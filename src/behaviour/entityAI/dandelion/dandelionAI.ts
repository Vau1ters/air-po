import { Entity } from '../../../ecs/entity'
import { World } from '../../../ecs/world'
import { Behaviour } from '../../behaviour'
import { dandelionBehaviour } from './dandelion'

export const dandelionAI = function*(entity: Entity, world: World): Behaviour<void> {
  yield* dandelionBehaviour(entity, world)
}
