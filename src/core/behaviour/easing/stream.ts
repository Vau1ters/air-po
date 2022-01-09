import { Behaviour } from '../behaviour'
import { ease } from './easing'
import { EasingFunction } from './functions'

export type StreamOption = {
  easing: EasingFunction
  duration: number
  to: number
}

export const stream = function* (
  callback: (value: number) => void,
  initialValue: number,
  streamOptions: StreamOption[]
): Behaviour<void> {
  let from = initialValue
  for (const streamOption of streamOptions) {
    const to = streamOption.to
    yield* ease(streamOption.easing)(streamOption.duration, callback, {
      from,
      to,
    })
    from = to
  }
}
