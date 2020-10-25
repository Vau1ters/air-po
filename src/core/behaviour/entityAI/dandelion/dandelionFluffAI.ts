import { Entity } from '../../../ecs/entity'
import { World } from '../../../ecs/world'
import { Behaviour } from '../../behaviour'
import { dandelionFluffBehaviour } from './dandelionFluff'

export const dandelionFluffAI = function*(entity: Entity, world: World): Behaviour<void> {
  yield* dandelionFluffBehaviour(entity, world)
}
