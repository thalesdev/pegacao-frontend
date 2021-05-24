import { Application, Container } from 'pixi.js'

export default class Screen {
  parent: Container
  container: Container
  app: Application
  constructor(parent: Container, app: Application) {
    this.parent = parent
    this.container = new Container()
    this.app = app
  }

  draw(): void {
    this.parent.addChild(this.container)
  }

  undraw(): void {
    this.parent.removeChild(this.container)
  }

  addChild(child: any): void {
    this.container.addChild(child)
  }

  removeChild(child: any): void {
    this.container.removeChild(child)
  }
}
