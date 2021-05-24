/* eslint-disable prettier/prettier */
import React, { useContext, useState } from 'react'
import { Container, Sprite, useApp, useTick, Graphics } from '@inlet/react-pixi'
import { GameContext } from '../../context/GameContext'
import { v4 } from 'uuid'

interface Cloud {
  key: string
  y: number
  x: number
  scale: number;
}

const animationProps = {
  fov: 20,
  amount: 20,
  stretch: 20,
  baseSize: 100,
  baseSpeed: 0.005,
  wBase: 179,
  hBase: 102
}

const useIteration = (incr = 0.1) => {
  const [i, setI] = useState(0)
  const app = useApp()

  useTick((delta) => {
    setI(i => (i + incr * delta) % app.screen.width)
  })

  return i
}

const StarLightBackground: React.FC = () => {
  const { warpSpeed } = useContext(GameContext)
  const app = useApp()

  // const i = useIteration(0.5)

  const [clouds, setClouds] = useState<Cloud[]>(() => {
    const CLOUDS: Cloud[] = []
    for (let i = 0; i < animationProps.amount; i++) {
      const scale = Math.floor(Math.random() * (1 - 0.5)) + 0.5
      // const width = animationProps.wBase * scale
      // const height = animationProps.hBase * scale
      const tempCloud = {
        key: v4(),
        y: Math.floor(Math.random() * (app.screen.height * (0.25 - 0.02))) + app.screen.height * 0.02,
        x: Math.floor(Math.random() * (app.screen.width)),
        scale
      }
      CLOUDS.push(tempCloud)
    }
    return CLOUDS
  })

  return (
    <Container>
      {clouds.map(({ key, scale, x, y }) => {
        return (
          <Sprite
            key={key}
            image="/img/bg_cloud.svg"
            scale={scale}
            x={x}
            y={y}
            anchor={0.5} />
        )
      })}
    </Container>
  )
}

export default StarLightBackground
