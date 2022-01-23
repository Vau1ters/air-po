import { windowSize } from '@core/application'
import { Behaviour } from '@core/behaviour/behaviour'
import { ease } from '@core/behaviour/easing/easing'
import { Out } from '@core/behaviour/easing/functions'
import { BlackAction } from '@game/movie/movie'
import { Graphics } from 'pixi.js'

export const blackActionAI = function* (action: BlackAction, g: Graphics): Behaviour<void> {
  const option = action.type === 'in' ? { from: 0, to: 1 } : { from: 1, to: 0 }
  yield* ease(Out.quad)(
    80,
    (value: number): void => {
      g.clear()
      g.beginFill(0x000000, value)
      g.drawRect(0, 0, windowSize.width, windowSize.height)
      g.endFill()
    },
    option
  )
}
