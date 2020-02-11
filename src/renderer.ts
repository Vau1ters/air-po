import * as PIXI from 'pixi.js'
const windowOption = {
  width: 800,
  height: 600,
}

export default class Renderer {
  static init(): void {
    const container = document.getElementById('container')
    if (container) {
      const app = new PIXI.Application({
        ...windowOption,
      })
      container.appendChild(app.view)

      const onResizeCallback = (): void => {
        const rect = container.getBoundingClientRect()
        const scale = Math.min(
          rect.width / windowOption.width,
          rect.height / windowOption.height
        )
        app.stage.scale.set(scale)
        app.renderer.resize(
          windowOption.width * scale,
          windowOption.height * scale
        )
      }
      onResizeCallback()
      window.addEventListener('resize', onResizeCallback)
      const g = new PIXI.Graphics()
      g.beginFill(0xff0000)
      g.drawRect(10, 10, 780, 580)
      g.endFill()
      app.stage.addChild(g)
    }
  }
}
