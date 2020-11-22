import { Behaviour } from '@core/behaviour/behaviour'
import { parallel } from '@core/behaviour/composite'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { airEffectBehaviour } from './airEffect'

export const airEffectAI = function*(entity: Entity, world: World): Behaviour<void> {
  yield* parallel([airEffectBehaviour(entity, world)])
}
