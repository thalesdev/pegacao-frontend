import React from 'react'
import { Stage as PIXIStage } from '@inlet/react-pixi'

interface StageProps {
  children?: any
  width?: number
  height?: number
}

export default function Stage({ children, width, height }: StageProps) {
  return (
    <PIXIStage
      width={window.innerWidth}
      height={window.innerHeight}
      options={{
        resolution: window.devicePixelRatio || 1,
        backgroundAlpha: 0
      }}
      onKeyPress={e => console.log('keypress,', e)}
    >
      {children}
    </PIXIStage>
  )
}
