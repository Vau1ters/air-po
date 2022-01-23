import { windowSize } from '@core/application'
import { Behaviour } from '@core/behaviour/behaviour'
import { ease } from '@core/behaviour/easing/easing'
import { Out } from '@core/behaviour/easing/functions'
import { CinemaScopeAction } from '@game/movie/movie'
import { Graphics } from 'pixi.js'

export const cinemaScopeActionAI = function* (
  action: CinemaScopeAction,
  g: Graphics
): Behaviour<void> {
  const option = action.type === 'in' ? { from: 0, to: 1 } : { from: 1, to: 0 }
  yield* ease(Out.quad)(
    150,
    (value: number): void => {
      const height = windowSize.height * 0.1 * value
      g.clear()
      g.beginFill(0x000000)
      g.drawRect(0, 0, windowSize.width, height)
      g.drawRect(0, windowSize.height - height, windowSize.width, height)
      g.endFill()
    },
    option
  )
}
