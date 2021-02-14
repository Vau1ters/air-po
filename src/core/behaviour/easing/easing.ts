import { Behaviour } from '../behaviour'
import { EasingFunction } from './functions'

export type Easing = (
  duration: number,
  callback: (value: number) => void,
  valueOption?: { from: number; to: number }
) => Behaviour<void>

export const ease = (easingFunction: EasingFunction): Easing =>
  function*(
    duration: number,
    callback: (value: number) => void,
    valueOption: { from: number; to: number } = { from: 0, to: 1 }
  ): Behaviour<void> {
    for (let time = 0; time < duration; time++) {
      callback(
        easingFunction(time / duration) * (valueOption.to - valueOption.from) + valueOption.from
      )
      yield
    }
    callback(easingFunction(1) * (valueOption.to - valueOption.from) + valueOption.from)
  }
