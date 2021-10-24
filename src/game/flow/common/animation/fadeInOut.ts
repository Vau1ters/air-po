import { Behaviour } from '@core/behaviour/behaviour'
import { ease } from '@core/behaviour/easing/easing'
import { Out, In } from '@core/behaviour/easing/functions'
import { filters } from 'pixi.js'

export const fadeInOut = function*(
  content: Behaviour<void>,
  alphaFilter: filters.AlphaFilter
): Behaviour<void> {
  yield* ease(Out.quad)(
    10,
    (value: number) => {
      alphaFilter.alpha = value
    },
    {
      from: 0,
      to: 1,
    }
  )

  yield* content

  yield* ease(In.quad)(
    10,
    (value: number) => {
      alphaFilter.alpha = value
    },
    {
      from: 1,
      to: 0,
    }
  )
}
