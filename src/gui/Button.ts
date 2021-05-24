import Sound from './Sound'
import Store from '../util/store'
import { Sprite } from 'pixi.js'

export default class Button {
  sprite: Sprite
  anchor: number
  x: number
  y: number
  soundClick: Sound
  soundHover: Sound
  soundHoverEnabled: boolean
  soundInHover: boolean
  soundClickEnabled: boolean

  constructor(
    src: string,
    x: number,
    y: number,
    anchor: number,
    onClick: CallableFunction,
    soundHover = false,
    soundClick = false
  ) {
    this.sprite = Sprite.from(src)
    this.anchor = anchor
    this.x = x
    this.y = y
    this.sprite.anchor.set(this.anchor)
    this.sprite.x = x
    this.sprite.y = y
    this.sprite.interactive = true
    this.sprite.buttonMode = true
    this.soundClickEnabled = soundClick
    this.soundClick = new Sound('/sounds/click_sound.mp3', false)
    this.soundClick.setVolume(Store.get('game@effects', 100))
    this.soundHoverEnabled = soundHover
    this.soundInHover = false
    this.soundHover = new Sound('/sounds/hover_sound.mp3', false)
    this.soundHover.setVolume(Store.get('game@effects', 100))
    Store.observe('game@effects', val => {
      this.soundClick.setVolume(val)
      this.soundHover.setVolume(val)
    })
    this.sprite
      .on(
        'pointerover',
        function (e) {
          this.sprite.scale.set(1.2, 1.2)
          if (this.soundHoverEnabled && !this.soundInHover) {
            this.soundHover.play()
            this.soundInHover = true
          }
        }.bind(this)
      )
      .on(
        'pointerout',
        function () {
          this.sprite.scale.set(1, 1)
          if (this.soundHoverEnabled && this.soundInHover) {
            this.soundHover.stop()
            this.soundInHover = false
          }
        }.bind(this)
      )
      .on(
        'pointerdown',
        function () {
          if (this.soundClickEnabled) {
            if (this.soundHoverEnabled && this.soundInHover) {
              this.soundHover.stop()
              this.soundInHover = false
            }
            this.soundClick.play()
          }
          onClick()
        }.bind(this)
      )
  }
}
