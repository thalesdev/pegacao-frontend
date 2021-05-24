import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from 'react'
import {
  Box,
  Button,
  Flex,
  HStack,
  ScaleFade,
  Spinner,
  Text,
  useToast
} from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { InGamePlayerBadge } from '../../components/InGamePlayerBadge'
import { io, Socket } from 'socket.io-client'
import { useRouter } from 'next/dist/client/router'
import { WS_HOST } from '../../configs/constants'
import Store from '../../util/store'
// import Store from '../../util/store'

const GameContextProvider = dynamic(() => import('../../context/GameContext'), {
  ssr: false
})

const Stage = dynamic(() => import('../../components/Stage'), {
  ssr: false
})

const RenderGame = dynamic(() => import('../../components/RenderGame'), {
  ssr: false
})
type PlayerSnapShot = {
  fingerprint: string
  username: string
  state: 'online' | 'lobby' | 'in-game' | 'disconected'
}
type PlayerGameSnapShot = {
  fingerprint: string
  point: {
    x: number
    y: number
  }
  radius: number
  alive?: boolean
}

interface MatchSnapshot {
  id: string
  host: PlayerSnapShot
  players: PlayerSnapShot[]
  state: 'lobby' | 'in-game' | 'finished'
  numPlayers: number
  game: {
    catcher: PlayerGameSnapShot
    fugitives: PlayerGameSnapShot[]
  }
}

export default function GameView() {
  const [socket, setSocket] = useState<Socket>(null)
  const [stage, setStage] = useState(0)
  const [snapshot, setSnapShot] = useState<MatchSnapshot>(null)
  const toast = useToast()

  const router = useRouter()

  const players = useMemo(() => {
    if (snapshot) {
      return [snapshot.game.catcher, ...snapshot.game.fugitives].map(snap => {
        const player =
          snapshot.players.find(p => p.fingerprint === snap.fingerprint) ||
          snapshot.host
        const isCatcher = snapshot.game.catcher.fingerprint === snap.fingerprint
        return {
          ...snap,
          ...player,
          type: isCatcher ? 'catcher' : 'fugitive'
        }
      })
    }
    return []
  }, [snapshot])
  const me = useMemo<PlayerGameSnapShot>(() => {
    const finger = Store.get('game@fingerprint', null)
    if (snapshot) {
      return [snapshot.game.catcher, ...snapshot.game.fugitives].find(
        p => p.fingerprint === finger
      )
    }
    return null
  }, [snapshot])

  const ImAlive = me?.alive

  const connect = useCallback(() => {
    const { id } = router.query
    if (!socket && id) {
      const tempSocket = io(WS_HOST)
      tempSocket
        .emit('syncPlayer', {
          fingerprint: Store.get('game@fingerprint', null),
          username: Store.get('game@username', null)
        })
        .emit('enterGame', {
          fingerprint: Store.get('game@fingerprint', null),
          token: Store.get('game@gameToken', null),
          matchID: id
        })
        .on('enterGame', ({ snapshot, err }) => {
          if (!err) {
            setSnapShot(snapshot)
            setStage(1)
          } else {
            toast({
              title: err,
              status: 'error',
              isClosable: true,
              duration: 2000
            })
            setTimeout(() => router.push('/'), 2000)
          }
        })
        .on(`in-game.snapshot.${id}`, snap => setSnapShot(snap))
        .on('syncRequest', data => {
          const { payload } = data
          if (payload) {
            tempSocket.emit('syncPlayer', {
              fingerprint: Store.get('game@fingerprint', null),
              username: Store.get('game@username', null)
            })
          }
        })
        .on('gameClosedByHost', () => {
          toast({
            status: 'error',
            isClosable: true,
            duration: 2000,
            title: 'A partida foi encerrada pelo host.'
          })
          socket?.close()
          setTimeout(() => router.push('/'), 2000)
        })
        .on('hostChange', ({ token }) => {
          Store.set('game@matchToken', token)
        })
        .on('banPlayerMatch', ({ err }) => {
          if (err) {
            toast({
              status: 'info',
              title: err,
              duration: 1000,
              isClosable: true
            })
          }
        })
        .on('ban', ({ message }) => {
          toast({
            duration: 3000,
            title: message,
            isClosable: false,
            status: 'error'
          })
          socket?.close()
          setTimeout(() => router.push('/'), 3000)
        })
      console.log('Iniciando socket')
      setSocket(tempSocket)
    }
  }, [router.query, toast])
  const handleKeys = useCallback(
    (event: KeyboardEvent) => {
      const { id } = router.query
      let dx = 0
      let dy = 0
      let command = 'move'
      let invalidKey = false
      switch (event.key) {
        case 'ArrowUp':
          dy = -1
          break
        case 'ArrowDown':
          dy = 1
          break
        case 'ArrowLeft':
          dx = -1
          break
        case 'ArrowRight':
          dx = 1
          break
        case 'x':
          command = 'catch'
          break
        default:
          invalidKey = true
      }
      if (!invalidKey && socket) {
        socket.emit('command', {
          payload: {
            dx,
            dy
          },
          command,
          fingerprint: Store.get('game@fingerprint', null),
          matchId: id
        })
      }
    },
    [socket]
  )

  useEffect(() => {
    if (stage === 0 && router.query.id) {
      connect()
    }
  }, [router.query, stage])

  useLayoutEffect(() => {
    document.addEventListener('keydown', handleKeys)
    return () => document.removeEventListener('keydown', handleKeys)
  }, [handleKeys])

  useEffect(() => console.log('players', players), [players])
  return (
    <>
      <Head>
        <title>Pegação - Jogo</title>
      </Head>
      <Flex
        w="95vw"
        h="95vh"
        align="center"
        justify={stage === 0 ? 'center' : 'flex-start'}
        pos="relative"
        direction="column"
        mx="auto"
        my="2.5vh"
      >
        {stage === 0 && (
          <>
            <ScaleFade initialScale={0.7} in={stage === 0}>
              <HStack spacing="1rem">
                <Text>Carregando partida</Text>
                <Spinner size="sm" />
              </HStack>
            </ScaleFade>
          </>
        )}
        {stage === 1 && (
          <>
            <HStack w="100%" minHeight="80px" bg="gray.900">
              {players.map(player => (
                <InGamePlayerBadge player={player} key={player.fingerprint} />
              ))}
            </HStack>
            <GameContextProvider>
              <Stage>
                <RenderGame game={snapshot?.game} />
              </Stage>
            </GameContextProvider>
            {!ImAlive && (
              <Flex
                pos="absolute"
                w="100vw"
                h="100vh"
                top="0"
                left="0"
                align="center"
                justify="center"
              >
                <Box p="8" bg="blue.600">
                  Você foi pego, tente novamente em outra partida.
                </Box>
              </Flex>
            )}
          </>
        )}
      </Flex>
    </>
  )
}
