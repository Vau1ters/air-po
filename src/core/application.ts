import * as PIXI from 'pixi.js'

export const windowSize = {
  width: 320,
  height: 240,
}

export const application = new PIXI.Application({
  ...windowSize,
})

export const initializeApplication = (): void => {
  const container = document.getElementById('container')
  if (!container) return
  container.appendChild(application.view)

  application.stage.sortableChildren = true
  application.renderer.autoDensity = true

  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
  PIXI.settings.ROUND_PIXELS = true

  const onResizeCallback = (): void => {
    const rect = container.getBoundingClientRect()
    const scale = Math.floor(
      Math.min(rect.width / windowSize.width, rect.height / windowSize.height)
    )
    application.view.style.setProperty('width', `${windowSize.width * scale}px`)
    application.view.style.setProperty('height', `${windowSize.height * scale}px`)
  }
  onResizeCallback()
  window.addEventListener('resize', onResizeCallback)
}
