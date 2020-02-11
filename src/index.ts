import Renderer from './renderer.ts'

class Main {
  static init(): void {
    Renderer.init()

    this.update()
  }
  static update(): void {
    console.log('up')
    requestAnimationFrame(Main.update)
  }
}
Main.init()
