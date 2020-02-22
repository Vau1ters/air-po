import * as PIXI from 'pixi.js'
import { Main } from '../index'

export default class Graphics {
  public static windowOption = {
    width: 800,
    height: 600,
  }
  public static app = new PIXI.Application({
    ...Graphics.windowOption,
  })
  public static graphics = new PIXI.Graphics()

  public static init(): void {
    const container = document.getElementById('container')
    if (!container) return
    container.appendChild(Graphics.app.view)

    const onResizeCallback = (): void => {
      const rect = container.getBoundingClientRect()
      const scale = Math.min(
        rect.width / Graphics.windowOption.width,
        rect.height / Graphics.windowOption.height
      )
      Graphics.app.stage.scale.set(scale)
      Graphics.app.renderer.resize(
        Graphics.windowOption.width * scale,
        Graphics.windowOption.height * scale
      )
    }
    onResizeCallback()
    window.addEventListener('resize', onResizeCallback)

    Graphics.app.stage.addChild(Graphics.graphics)
    Graphics.app.ticker.add(delta => Main.world.update(delta / 60))
  }
}
