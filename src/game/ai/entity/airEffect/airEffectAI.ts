import { Behaviour } from '@core/behaviour/behaviour'
import { parallel } from '@core/behaviour/composite'
import { Entity } from '@core/ecs/entity'
import { airEffectBehaviour } from './airEffect'

export const airEffectAI = function*(entity: Entity): Behaviour<void> {
  yield* parallel([airEffectBehaviour(entity)])
}
