import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAll } from '@core/behaviour/composite'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { JetEffectBehaviour } from './jetEffect'

export const JetEffectAI = function*(entity: Entity, world: World): Behaviour<void> {
  yield* parallelAll([JetEffectBehaviour(entity, world)])
}
