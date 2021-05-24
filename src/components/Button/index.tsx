import React, { useEffect, useState } from 'react'
import { Container } from 'pixi.js'
import GUIButton from '../../gui/Button'

interface ButtonProps {
  parent: Container
  src: string
  x: number
  y: number
  anchor: number
  onClick: CallableFunction
  soundHover: boolean
  soundClick: boolean
}

const Button: React.FC<ButtonProps> = ({
  parent,
  src,
  x,
  y,
  anchor,
  onClick,
  soundHover = false,
  soundClick = false
}) => {
  const [button, setButton] = useState<GUIButton>(null)

  useEffect(() => {
    const tempButton: GUIButton = new GUIButton(
      src,
      x,
      y,
      anchor,
      onClick,
      soundHover,
      soundClick
    )
    setButton(tempButton)
    parent.addChild(tempButton.sprite)
    return () => parent.removeChild(button.sprite)
  }, [])
  return <></>
}

export default Button
