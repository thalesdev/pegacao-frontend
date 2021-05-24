import React, { useRef } from 'react'
import {
  Avatar,
  HStack,
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  Button,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  PopoverFooter,
  Box,
  ButtonGroup,
  IconButton,
  Spinner,
  Flex
} from '@chakra-ui/react'
import { AiOutlineMore } from 'react-icons/ai'
import { FaChessKing } from 'react-icons/fa'
import Store from '../util/store'

interface PlayerBadgeProps {
  player: {
    fingerprint: string
    username: string
    state: 'online' | 'lobby' | 'in-game' | 'disconected'
  }
  isOwner?: boolean
  crown?: boolean
  makeHost?: CallableFunction
  banPlayer?: CallableFunction
}

export function PlayerBadge({
  player,
  isOwner,
  crown,
  makeHost,
  banPlayer
}: PlayerBadgeProps) {
  const initialFocusRef = useRef()

  const isMe = player.fingerprint === Store.get('game@fingerprint')
  return (
    <HStack
      spacing="4"
      px="4"
      py="2"
      _hover={{ bg: 'gray.600' }}
      cursor="default"
    >
      <Avatar name={player.username} size="sm" />
      <Flex flex="1" direction="column">
        <Text>{player.username}</Text>
        {player.state === 'disconected' && (
          <>
            <Text>Reconectando</Text>
            <Spinner size="sm" />
          </>
        )}
      </Flex>
      {isOwner && !isMe && (
        <Popover
          initialFocusRef={initialFocusRef}
          placement="right"
          closeOnBlur={false}
          arrowShadowColor="gray.900"
        >
          <PopoverTrigger>
            <Button
              leftIcon={<AiOutlineMore size="18" />}
              aria-label="Mais opções"
              size="xs"
              variant="unstyled"
              color="white"
            />
          </PopoverTrigger>
          <PopoverContent color="white" bg="blue.800" borderColor="blue.800">
            <PopoverHeader pt={4} fontWeight="bold" border="0">
              Gerenciar Jogador
            </PopoverHeader>
            <PopoverArrow bg="blue.800" />
            <PopoverCloseButton />
            <PopoverBody>
              Tome cuidado com o que vai fazer, as ações são permanentes e não
              podem ser desfeitas.
            </PopoverBody>
            <PopoverFooter
              border="0"
              d="flex"
              alignItems="center"
              justifyContent="space-between"
              pb={4}
            >
              <Box fontSize="sm">Ações</Box>
              <ButtonGroup size="sm">
                <Button
                  colorScheme="red"
                  onClick={e => banPlayer(player.fingerprint)}
                >
                  Expulsar da Sala
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={e => makeHost(player.fingerprint)}
                >
                  Tornar Host
                </Button>
              </ButtonGroup>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      )}
      {crown && <FaChessKing />}
    </HStack>
  )
}
