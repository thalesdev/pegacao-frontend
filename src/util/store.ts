interface EventInterface {
  key: string
  callback: CallableFunction
}

export default class Store {
  static listeners: EventInterface[] = []
  static observe(key: string, callback: CallableFunction): Store {
    this.listeners.push({ key, callback })
    return this
  }

  static set(key: string, val: any): void {
    window.localStorage.setItem(key, JSON.stringify(val))

    this.listeners
      .filter(({ key: k }) => k === key)
      .forEach(({ callback }) => callback(val))
  }

  static get(key: string, val?: any): any {
    const item = window.localStorage.getItem(key)
    if (!item) {
      this.set(key, val)
    }
    return item ? JSON.parse(item) : val
  }

  static randomStr(length = 16): string {
    let result = ''
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }
}
