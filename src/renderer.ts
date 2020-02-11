import * as PIXI from 'pixi.js'
const windowOption = {
  width: 800,
  height: 600,
}

export default class Renderer {
  static app: PIXI.Application

  public static init(): void {
    const container = document.getElementById('container')
    if (container) {
      this.app = new PIXI.Application({
        ...windowOption,
      })
      container.appendChild(this.app.view)

      const onResizeCallback = (): void => {
        const rect = container.getBoundingClientRect()
        const scale = Math.min(
          rect.width / windowOption.width,
          rect.height / windowOption.height
        )
        this.app.stage.scale.set(scale)
        this.app.renderer.resize(
          windowOption.width * scale,
          windowOption.height * scale
        )
      }
      onResizeCallback()
      window.addEventListener('resize', onResizeCallback)
    }
  }
  // note : のちのち画像を使いたくなったらここはPIXI.Spriteにするべきかもしれない
  public static add(sprite: PIXI.Graphics): void {
    this.app.stage.addChild(sprite)
  }
}
