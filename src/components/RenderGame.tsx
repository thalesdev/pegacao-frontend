import { Container, Graphics } from '@inlet/react-pixi'
import React, { useCallback } from 'react'

type PlayerGameSnapShot = {
  fingerprint: string
  point: {
    x: number
    y: number
  }
  radius: number
  alive?: boolean
}
interface RenderGameProps {
  game: {
    catcher: PlayerGameSnapShot
    fugitives: PlayerGameSnapShot[]
  }
}

interface PlayerProps {
  x: number
  y: number
  radius: number
  isCatcher?: boolean
}

function Player({ x, y, radius, isCatcher }: PlayerProps) {
  const draw = useCallback(
    g => {
      g.clear()
      g.beginFill(isCatcher ? 0x0d53f8c : 0x000)
      g.drawCircle(x, y, radius)
      g.endFill()
    },
    [x, y, radius]
  )

  return <Graphics draw={draw} />
}
export default function RenderGame({
  game: { catcher, fugitives }
}: RenderGameProps) {
  return (
    <Container width={800} height={600} x={0} y={0}>
      <Player {...catcher.point} radius={catcher.radius} isCatcher />
      {fugitives.map(
        fugitive =>
          fugitive.alive && (
            <Player
              {...fugitive.point}
              radius={fugitive.radius}
              key={fugitive.fingerprint}
            />
          )
      )}
    </Container>
  )
}
