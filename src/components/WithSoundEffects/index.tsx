import React, { cloneElement, useEffect, useState } from 'react'
import Sound from '../../gui/Sound'
import Store from '../../util/store'

// import { Container } from './styles';
interface WithSoundEffectsProps {
  children: any
}

const WithSoundEffects: React.FC = ({ children }: WithSoundEffectsProps) => {
  const [soundInHover, setSoundInHover] = useState(false)

  const soundClick = new Sound('/sounds/click_sound.mp3', false)
  const soundHover = new Sound('/sounds/hover_sound.mp3', false)

  useEffect(() => {
    soundClick.setVolume(Store.get('game@effects', 100))
    soundHover.setVolume(Store.get('game@effects', 100))
    Store.observe('game@effects', val => {
      soundClick.setVolume(val)
      soundHover.setVolume(val)
    })
    // trabalhar no unobserve
  }, [])

  return cloneElement(children, {
    onMouseEnter: e => {
      if (!soundInHover) {
        soundHover.play()
        setSoundInHover(true)
      }

      if (children.props.onMouseEnter) {
        children.props.onMouseEnter()
      }
    },
    onMouseLeave: e => {
      if (soundInHover) {
        soundHover.stop()
        setSoundInHover(false)
      }
      if (children.props.onMouseLeave) {
        children.props.onMouseLeave()
      }
    },
    onClick: e => {
      if (soundInHover) {
        soundHover.stop()
        setSoundInHover(false)
      }
      soundClick.play()
      if (children.props.onClick) {
        children.props.onClick()
      }
    }
  })
}

export default WithSoundEffects
