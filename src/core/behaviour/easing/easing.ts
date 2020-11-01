import { Behaviour } from '../behaviour'
import { EasingFunction } from './functions'

export type Easing = (
  duration: number,
  callback: (value: number) => void,
  valueOption?: { start: number; end: number }
) => Behaviour<void>

export const createEasing = (easingFunction: EasingFunction): Easing =>
  function*(
    duration: number,
    callback: (value: number) => void,
    valueOption: { start: number; end: number } = { start: 0, end: 1 }
  ): Behaviour<void> {
    for (let time = 0; time < duration; time++) {
      const value =
        easingFunction(time / duration) * (valueOption.end - valueOption.start) + valueOption.start
      callback(value)
      yield
    }
    callback(valueOption.end)
  }
