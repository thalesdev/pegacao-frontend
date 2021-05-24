export default class Sound {
  sound: HTMLAudioElement
  constructor(src: string, loop = false, shared = true) {
    const audioExists = document.querySelector(`audio[src="${src}"]`)
    if (audioExists && shared) {
      this.sound = (audioExists as unknown) as HTMLAudioElement
      return this
    }

    this.sound = document.createElement('audio')
    this.sound.src = src
    this.sound.setAttribute('preload', 'auto')
    this.sound.setAttribute('controls', 'none')
    if (loop) {
      this.sound.setAttribute('loop', 'true')
    }
    this.sound.style.display = 'none'
    document.body.appendChild(this.sound)
  }

  play(): void {
    this.sound.play()
  }

  stop(): void {
    this.sound.pause()
  }

  setVolume(val: number | string): void {
    if (typeof val !== 'undefined' && typeof val !== 'string') {
      this.sound.volume = val / 100
    }
  }
}
