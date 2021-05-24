import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import {
  Flex,
  HStack,
  Text,
  Spinner,
  ScaleFade,
  Box,
  Heading,
  Stack,
  Button,
  useToast
} from '@chakra-ui/react'
import { io, Socket } from 'socket.io-client'
import { WS_HOST } from '../../configs/constants'
import Store from '../../util/store'
import { useRouter } from 'next/dist/client/router'
import { PlayerBadge } from '../../components/PlayerBadge'

type PlayerSnapShot = {
  fingerprint: string
  username: string
  state: 'online' | 'lobby' | 'in-game' | 'disconected'
}

interface MatchSnapshot {
  id: string
  host: PlayerSnapShot
  players: PlayerSnapShot[]
  state: 'lobby' | 'in-game' | 'finished'
  numPlayers: number
}

const Lobby: React.FC = () => {
  const [stage, setStage] = useState(0)
  const router = useRouter()
  const [snapshot, setSnapShot] = useState<MatchSnapshot>(null)
  const toast = useToast()

  const { id } = router.query

  const lenPlayers = useMemo(() => {
    if (snapshot) {
      // return snapshot.players.filter(p => p.state !== 'disconected').length + 1
      return snapshot.players.length + 1
    }
    return 0
  }, [snapshot])

  const maxPlayers = useMemo(() => {
    if (snapshot) return snapshot.numPlayers
    return 0
  }, [snapshot])

  const readyToPlay = useMemo(() => lenPlayers === maxPlayers, [
    lenPlayers,
    maxPlayers
  ])

  const isOwner = useMemo(() => {
    if (snapshot) {
      return snapshot.host.fingerprint === Store.get('game@fingerprint')
    }
    return false
  }, [snapshot])

  const playerIsOwner = useCallback(
    pid => {
      if (snapshot) {
        return snapshot.host.fingerprint === pid
      }
      return false
    },
    [snapshot]
  )

  const [socket, setSocket] = useState<Socket>(null)

  const connect = useCallback(() => {
    const { id } = router.query
    if (!socket && id) {
      const tempSocket = io(WS_HOST)
      tempSocket
        .emit('syncPlayer', {
          fingerprint: Store.get('game@fingerprint', null),
          username: Store.get('game@username', null)
        })
        .emit('enterMatch', {
          fingerprint: Store.get('game@fingerprint', null),
          token: Store.get('game@matchToken', null),
          matchID: id
        })
        .on('enterMatch', ({ snapshot, err }) => {
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
        .on(`lobby.snapshot.${id}`, snap => setSnapShot(snap))
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
        .on('accessGame', ({ token }) => {
          Store.set('game@gameToken', token)
          toast({
            duration: 5000,
            title: 'Iniciando a partida... em 5 segundos',
            isClosable: false,
            status: 'info'
          })

          setTimeout(() => router.push(`/game/${id}`), 5000)
        })
      setSocket(tempSocket)
    }
  }, [router.query, toast])

  const handleLeaveMatch = useCallback(
    e => {
      const { id } = router.query
      e.preventDefault()
      if (isOwner) {
        socket.emit('closeMatch', {
          fingerprint: Store.get('game@fingerprint', null),
          matchID: id
        })
      }
      socket.close()
      router.push('/')
    },
    [router.query, socket, isOwner]
  )
  const handleMakeHost = useCallback(
    (playerId: string) => {
      if (socket && isOwner) {
        const { id } = router.query
        socket.emit('makeHost', {
          hostId: Store.get('game@fingerprint', null),
          matchId: id,
          newHostId: playerId
        })
      }
    },
    [socket, isOwner, router.query]
  )

  const handleBanPlayer = useCallback(
    (playerId: string) => {
      if (socket && isOwner) {
        const { id } = router.query
        socket.emit('banPlayerMatch', {
          hostId: Store.get('game@fingerprint', null),
          matchId: id,
          playerId: playerId
        })
      }
    },
    [socket, isOwner, router.query]
  )
  const handlePlay = useCallback(() => {
    if (isOwner && socket) {
      const { id } = router.query
      socket.emit('startMatch', {
        fingerprint: Store.get('game@fingerprint', null),
        matchId: id
      })
    }
  }, [socket, isOwner, router.query])

  useEffect(() => {
    if (stage === 0 && router.query.id) {
      connect()
    }
  }, [router.query, stage])

  useEffect(() => {
    console.log('match snapshot:', snapshot)
  }, [snapshot])
  return (
    <>
      <Head>
        <title>Pegação - Sala de Espera</title>
      </Head>
      <Flex w="100vw" h="100vh" align="center" justify="center" pos="relative">
        {stage === 0 && (
          <ScaleFade initialScale={0.7} in={stage === 0}>
            <HStack spacing="1rem">
              <Text>Carregando informações da partida</Text>
              <Spinner size="sm" />
            </HStack>
          </ScaleFade>
        )}
        {stage === 1 && (
          <ScaleFade initialScale={0.9} in={stage === 1}>
            <HStack spacing="1rem" flex={1} w="95vw">
              <Flex
                as="aside"
                width="280px"
                borderRadius="lg"
                height="80vh"
                bg="gray.800"
                direction="column"
              >
                <Box
                  as="header"
                  w="100%"
                  px="8"
                  py="2"
                  alignContent="center"
                  borderBottom="1px solid"
                  borderBottomColor="gray.900"
                >
                  <Text fontSize="xl">
                    Jogadores {`(${lenPlayers}/${maxPlayers})`}
                  </Text>
                </Box>
                <Stack>
                  {snapshot &&
                    [snapshot.host, ...snapshot.players]
                      // .filter(p => p.state !== 'disconected')
                      .map(player => (
                        <PlayerBadge
                          key={player.fingerprint}
                          player={player}
                          isOwner={isOwner}
                          crown={playerIsOwner(player.fingerprint)}
                          makeHost={handleMakeHost}
                          banPlayer={handleBanPlayer}
                        />
                      ))}
                </Stack>
              </Flex>
              <Flex
                flex="1"
                as="main"
                height="80vh"
                justify="flex-start"
                px="6"
                pb="6"
              >
                <Flex
                  flex="1"
                  justify="flex-end"
                  align="center"
                  direction="column"
                >
                  <Heading>Sala:</Heading>
                  <Heading
                    cursor="pointer"
                    onClick={async e => {
                      await navigator.clipboard.writeText(
                        (id as unknown) as string
                      )
                      toast({
                        title: 'Código Copiado',
                        description:
                          'O código da sala foi copiado para área de transferência.',
                        status: 'success',
                        duration: 500,
                        isClosable: true
                      })
                    }}
                  >
                    {id}
                  </Heading>
                </Flex>
                <Flex
                  justify="space-between"
                  direction="column"
                  align="flex-end"
                  mt="-6"
                >
                  <img src="/img/logo.png" alt="Logo Pegação" />
                  <HStack>
                    <Button
                      size="lg"
                      color="pink.500"
                      bg="gray.900"
                      height="5.5rem"
                      fontSize="x-large"
                      borderRadius="full"
                      mb="-6"
                      _hover={{
                        bg: 'pink.500',
                        color: 'gray.900'
                      }}
                      onClick={handleLeaveMatch}
                    >
                      Sair
                    </Button>
                    {isOwner && (
                      <Button
                        size="lg"
                        color="pink.500"
                        bg="gray.900"
                        height="8.5rem"
                        fontSize="xx-large"
                        borderRadius="full"
                        mb="-6"
                        _hover={{
                          bg: 'pink.500',
                          color: 'gray.900'
                        }}
                        disabled={!readyToPlay}
                        onClick={handlePlay}
                      >
                        Jogar
                      </Button>
                    )}
                  </HStack>
                </Flex>
              </Flex>
            </HStack>
          </ScaleFade>
        )}
      </Flex>
    </>
  )
}
export default Lobby
