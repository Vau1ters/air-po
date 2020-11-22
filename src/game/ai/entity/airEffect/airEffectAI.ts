import { Behaviour } from '@core/behaviour/behaviour'
import { parallel } from '@core/behaviour/composite'
import { airEffectBehaviour } from './airEffect'

export const airEffectAI = function*(): Behaviour<void> {
  yield* parallel([airEffectBehaviour()])
}
