import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAll } from '@core/behaviour/composite'
import { ease } from '@core/behaviour/easing/easing'
import { Vec2 } from '@core/math/vec2'
import { StemState } from './stem'

export const wakeup = function*(state: StemState): Behaviour<void> {
  while (true) {
    const a = 0.01
    const b = 20
    const s = Math.sin(a)
    const c = Math.cos(a)
    yield
  }
}
