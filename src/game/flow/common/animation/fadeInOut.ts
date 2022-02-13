import { Behaviour } from '@core/behaviour/behaviour'
import { ease } from '@core/behaviour/easing/easing'
import { Out, In } from '@core/behaviour/easing/functions'
import { AlphaFilter } from '@pixi/filter-alpha'

export const fadeInOut = function* <T>(
  content: Behaviour<T>,
  alphaFilters: AlphaFilter[]
): Behaviour<T> {
  yield* ease(Out.quad)(
    10,
    (value: number) => {
      for (const f of alphaFilters) f.alpha = value
    },
    {
      from: 0,
      to: 1,
    }
  )

  const result = yield* content

  yield* ease(In.quad)(
    10,
    (value: number) => {
      for (const f of alphaFilters) f.alpha = value
    },
    {
      from: 1,
      to: 0,
    }
  )

  return result
}
