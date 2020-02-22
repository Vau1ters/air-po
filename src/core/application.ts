import * as PIXI from 'pixi.js'

export const windowSize = {
  width: 800,
  height: 600,
}

export const application = new PIXI.Application({
  ...windowSize,
})

export const initializeApplication = (): void => {
  const container = document.getElementById('container')
  if (!container) return
  container.appendChild(application.view)

  application.stage.sortableChildren = true

  const onResizeCallback = (): void => {
    const rect = container.getBoundingClientRect()
    const scale = Math.min(
      rect.width / windowSize.width,
      rect.height / windowSize.height
    )
    application.stage.scale.set(scale)
    application.renderer.resize(
      windowSize.width * scale,
      windowSize.height * scale
    )
  }
  onResizeCallback()
  window.addEventListener('resize', onResizeCallback)
}
