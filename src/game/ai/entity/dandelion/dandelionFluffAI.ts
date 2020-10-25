import { Entity } from '../../../../core/ecs/entity'
import { World } from '../../../../core/ecs/world'
import { Behaviour } from '../../../../core/behaviour/behaviour'
import { dandelionFluffBehaviour } from './dandelionFluff'

export const dandelionFluffAI = function*(entity: Entity, world: World): Behaviour<void> {
  yield* dandelionFluffBehaviour(entity, world)
}
