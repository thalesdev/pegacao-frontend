import { Graphics, Container } from 'pixi.js'

interface SliderProps {
  x: number
  y: number
  height: number
  width: number
  parent: Container
  value?: number
  handleWidth?: number
  handleHeight?: number
}

export default class Slider {
  x: number
  y: number
  height: number
  width: number
  parent: Container
  container: Container
  value: number
  handleWidth: number
  handleHeight: number
  trailing: Graphics
  handle: Graphics
  graphicsContainer: Graphics
  listeners: CallableFunction[] = []
  dragging: boolean
  data: any

  constructor({
    x,
    y,
    height,
    width,
    parent,
    value = 50,
    handleWidth = 10,
    handleHeight = 10
  }: SliderProps) {
    this.parent = parent
    this.container = new Container()
    this.graphicsContainer = new Graphics()
    this.trailing = new Graphics()
    this.handle = new Graphics()

    this.container.addChild(this.graphicsContainer)
    this.container.addChild(this.trailing)
    this.container.addChild(this.handle)

    this.handle.interactive = true
    this.handle.buttonMode = true

    this.x = x
    this.y = y
    this.height = height
    this.width = width
    this.value = value
    this.handleWidth = handleWidth
    this.handleHeight = handleHeight
    this.listeners = []

    this.handle
      .on('pointerdown', this.onDragStart.bind(this))
      .on('pointerup', this.onDragEnd.bind(this))
      .on('pointerupoutside', this.onDragEnd.bind(this))
      .on('pointermove', this.onDragMove.bind(this))
    this.fill()
  }

  draw(): void {
    this.parent.addChild(this.container)
  }

  fill(): void {
    this.graphicsContainer.clear()
    this.trailing.clear()
    this.handle.clear()

    this.graphicsContainer.beginFill(0xcccccc)

    // anchor manual em 0.5
    this.graphicsContainer.drawRect(
      this.x - this.width / 2,
      this.y + this.height / 2,
      this.width,
      this.height
    )
    this.graphicsContainer.endFill()

    this.trailing.beginFill(0xf831ff)
    this.trailing.drawRect(
      this.x - this.width / 2,
      this.y + this.height / 2,
      this.width * (this.value / 100),
      this.height
    )

    this.trailing.endFill()

    this.handle.beginFill(0x333333)
    this.handle.drawRect(
      this.x - this.width / 2 + this.width * (this.value / 100),
      this.y - this.handleHeight / 2 + this.height / 2,
      this.handleWidth,
      this.handleHeight + this.height
    )
    this.handle.endFill()
  }

  setPos(x: number, y: number): void {
    this.x = x
    this.y = y
    this.fill()
  }

  onDragStart(event: any): void {
    this.dragging = true
    this.data = event.data
  }

  onDragEnd(): void {
    this.dragging = false
    this.data = null
  }

  onDragMove(): void {
    if (this.dragging) {
      const { x } = this.data.getLocalPosition(this.parent)
      const initX = this.x - this.width / 2
      const value = ((x - initX) / this.width) * 100
      const newValue = value > 0 ? (value <= 100 ? value : 100) : 0
      this.setValue(newValue)
      this._notifyAll(newValue)
    }
  }

  _notifyAll(data: any): void {
    this.listeners.forEach(listener => listener(data))
  }

  onChange(callback: CallableFunction): Slider {
    this.listeners.push(callback)
    return this
  }

  setValue(x: number): void {
    this.value = x
    this.fill()
  }
}
