import { Application, Container, Sprite, Text } from 'pixi.js'
import * as TextInput from 'pixi-text-input'
import GUIScreen from '../gui/Screen'
import Store from '../util/store'
import Slider from '../gui/Slider'

export default class ConfigScreen extends GUIScreen {
  constructor(parent: Container, app: Application) {
    super(parent, app)
    this.init()
    console.log('alo')
  }

  init(): void {
    const logo = Sprite.from('/img/logo.png')
    logo.anchor.set(0.5)
    logo.x = this.app.screen.width * 0.2
    logo.y = this.app.screen.height * 0.1
    this.addChild(logo)

    const title = new Text('CONFIGURAÇÕES', {
      fontFamily: 'Roboto',
      fontSize: 50,
      fill: 'white',
      align: 'left'
    })
    title.anchor.set(0.5)
    title.position.set(this.app.screen.width / 2, this.app.screen.height * 0.1)
    this.container.addChild(title)

    const back = Sprite.from('/img/back_button.svg')
    back.interactive = true
    back.buttonMode = true
    back.anchor.set(0.5)
    back.position.set(this.app.screen.width / 2, this.app.screen.height - 50)
    back
      .on('pointerover', function () {
        const el = (back as unknown) as any
        el.style = {
          ...el.style,
          fill: '#F831FF'
        }
      })
      .on('pointerout', function () {
        const el = (back as unknown) as any
        el.style = {
          ...el.style,
          fill: 'white'
        }
      })
      .on('pointerdown', function () {
        // openContainer(menuContainer)
      })
    this.addChild(back)

    const options = {
      'BGM Volume': [
        new Slider({
          height: 8,
          width: this.app.screen.width * 0.2,
          parent: this.container,
          x: 0,
          y: 0,
          value: Store.get('game@bgm', 50)
        }).onChange(val => {
          Store.set('game@bgm', parseInt(val, 10))
        }),
        120
      ],
      'Efeitos Volume': [
        new Slider({
          height: 8,
          width: this.app.screen.width * 0.2,
          parent: this.container,
          x: 0,
          y: 0,
          value: Store.get('game@effects', 50)
        }).onChange(val => {
          Store.set('game@effects', parseInt(val, 10))
        }),
        120
      ],

      Apelido: [
        new TextInput({
          input: {
            fontSize: '20px',
            padding: '12px',
            width: this.app.screen.width * 0.25 + 'px',
            color: '#26272E',
            height: '20px'
          },
          box: {
            default: {
              fill: 0xe8e9f3,
              rounded: 12,
              stroke: { color: 0xcbcee0, width: 3 }
            },
            focused: {
              fill: 0xe1e3ee,
              rounded: 12,
              stroke: { color: 0xabafc6, width: 3 }
            },
            disabled: { fill: 0xdbdbdb, rounded: 12 }
          }
        }),
        120
      ]
    }

    const optionsArray = Object.entries(options)
    const gap = 10
    const yOptions = this.app.screen.height * 0.25
    for (let i = 0; i < optionsArray.length; i++) {
      const [element, size] = optionsArray[i][1]
      const label = optionsArray[i][0]
      const tempText = new Text(label, {
        fontFamily: 'Roboto',
        fontSize: 38,
        fontWeight: 'bold',
        fill: 'yellow',
        align: 'left'
      })
      tempText.anchor.set(0.5)
      tempText.position.set(
        this.app.screen.width / 2,
        yOptions + i * (gap + size)
      )
      this.addChild(tempText)
      if (element) {
        if (element.draw) {
          element.draw()
          element.setPos(
            this.app.screen.width / 2,
            yOptions + i * (gap + size) + tempText.height + 20
          )
        } else {
          element.x = this.app.screen.width / 2
          element.y = yOptions + i * (gap + size) + tempText.height + 20
          element.pivot.x = element.width / 2
          element.pivot.y = element.height / 2
          element.placeholder = 'Digite seu Nickname'
          element.text = Store.get('game@nickname', Store.randomStr())
          element.on('keydown', _ => {
            Store.set('game@nickname', element.text)
          })
          this.container.addChild(element)
        }
      }
    }
  }
}
