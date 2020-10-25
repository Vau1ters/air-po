import { Entity } from '../../../../core/ecs/entity'
import { World } from '../../../../core/ecs/world'
import { Behaviour } from '../../../../core/behaviour/behaviour'
import { dandelionBehaviour } from './dandelion'

export const dandelionAI = function*(entity: Entity, world: World): Behaviour<void> {
  yield* dandelionBehaviour(entity, world)
}
