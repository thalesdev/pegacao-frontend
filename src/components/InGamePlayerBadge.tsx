import { Avatar, HStack, Text } from '@chakra-ui/react'
import React from 'react'
interface PropsInGamePlayerBadge {
  player: {
    fingerprint: string
    point: {
      x: number
      y: number
    }
    radius: number
    alive?: boolean
    type: string
    username: string
  }
}
export function InGamePlayerBadge({ player }: PropsInGamePlayerBadge) {
  return (
    <>
      <HStack
        spacing="4"
        px="4"
        style={{ filter: !player.alive ? 'grayscale(0.9) blur(1px)' : '' }}
        height="100%"
        bg={player.type === 'catcher' ? 'pink.500' : 'transparent'}
      >
        <Avatar name={player.username} />
        <Text>{player.username}</Text>
      </HStack>
    </>
  )
}
