import { EventNotifier } from '@utils/eventNotifier'
import * as PIXI from 'pixi.js'

export const windowSize = {
  width: 320,
  height: 240,
}

export const application = new PIXI.Application({
  ...windowSize,
})

export type ScreenScaleMode = 'Integer' | 'Float'

export const applicationSetting: {
  screenScaleMode: ScreenScaleMode
} = {
  screenScaleMode: 'Integer',
}

export const windowResizeEvent = new EventNotifier<void>()

export const initializeApplication = (): void => {
  const container = document.getElementById('container')
  if (!container) return
  container.appendChild(application.view)

  application.stage.sortableChildren = true

  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
  PIXI.settings.ROUND_PIXELS = true
  application.ticker.maxFPS = 60

  const onResizeCallback = (): void => {
    const rect = container.getBoundingClientRect()

    let scale = Math.min(rect.width / windowSize.width, rect.height / windowSize.height)
    if (applicationSetting.screenScaleMode === 'Integer') {
      scale = Math.floor(scale)
    }

    application.view.style.setProperty('width', `${windowSize.width * scale}px`)
    application.view.style.setProperty('height', `${windowSize.height * scale}px`)
  }
  onResizeCallback()
  windowResizeEvent.addObserver(onResizeCallback)
  window.addEventListener('resize', () => windowResizeEvent.notify())
}
