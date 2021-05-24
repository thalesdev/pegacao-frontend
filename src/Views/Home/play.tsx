import {
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  IconButton,
  Button,
  Text
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import Store from '../../util/store'
import WithSoundEffects from '../../components/WithSoundEffects'
import { WS_HOST } from '../../configs/constants'
import { useRouter } from 'next/dist/client/router'

// import styles from './configs.module.scss'
// import { Container } from './styles'

interface PlayProps {
  handle: CallableFunction
}
const Play: React.FC<PlayProps> = ({ handle }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [matchId, setMatchId] = useState('')
  const router = useRouter()
  let socket: Socket = null

  function ensureSocket() {
    if (!socket) {
      const tempSocket = io(WS_HOST)
      tempSocket
        .emit('syncPlayer', {
          fingerprint: Store.get('game@fingerprint', null),
          username: Store.get('game@username', null)
        })
        .on('grantAccessMatch', ({ err, token }) => {
          if (err) {
            console.log('Deu ruim') // mostrar algum erro
          } else {
            Store.set('game@matchToken', token)
            router.push(`/lobby/${matchId}`)
          }
          setIsLoading(false)
        })
        .on('createMatch', ({ err, token, id }) => {
          setIsLoading(false)
          if (err) {
            console.log('erro:', id) // mostrar algo de erro
          } else {
            Store.set('game@matchToken', token)
            router.push(`/lobby/${id}`)
          }
        })
      socket = tempSocket
    }
    return socket
  }

  async function handlePlay() {
    setIsLoading(true)
    ensureSocket().emit('grantAccessMatch', {
      matchId,
      fingerprint: Store.get('game@fingerprint', null)
    })
  }

  async function handleCreate() {
    setIsLoading(true)
    ensureSocket().emit('createMatch', {
      fingerprint: Store.get('game@fingerprint', null)
    })
  }

  return (
    <Flex align="center" justify="center">
      <Flex
        mx="auto"
        direction="column"
        maxWidth="1140px"
        p="8"
        height="100vh"
        pt="3rem"
        align="center"
      >
        <Heading>Jogar</Heading>
        <Flex
          direction="column"
          spacing="3"
          flex="1"
          align="center"
          justify="start"
          py="4rem"
        >
          <Stack spacing="8">
            <FormControl id="apelido">
              <FormLabel fontSize="xl" mb="3">
                Código da sala
              </FormLabel>
              <Input
                type="text"
                name="play_code"
                onChange={e => {
                  setMatchId(e.target.value.replace(/[^\w]/gi, ''))
                }}
                maxLength={16}
                minLength={3}
                focusBorderColor="pink.500"
                bg="gray.900"
                variant="filled"
                _hover={{ bgColor: 'gray.900' }}
                _focus={{ bgColor: 'gray.700' }}
                size="lg"
              />
            </FormControl>
            <Button
              colorScheme="pink"
              onClick={handlePlay}
              isLoading={isLoading}
            >
              Entrar
            </Button>
            <Text textAlign="center">Ou</Text>
            <Button
              bg="gray.900"
              cursor="pointer"
              _hover={{ bg: 'gray.800' }}
              onClick={handleCreate}
            >
              Criar Jogo
            </Button>
          </Stack>
        </Flex>

        <WithSoundEffects>
          <IconButton
            onClick={e => handle(-1)}
            aria-label="Botão de voltar"
            variant="link"
            icon={<img src="/img/back_button.svg" alt="Botão de voltar" />}
          />
        </WithSoundEffects>
      </Flex>
    </Flex>
  )
}

export default Play
