import { Entity } from '../ecs/entity'
import { World } from '../ecs/world'
import { Behaviour } from '../behaviour/behaviour'
import { dandelionFluffBehaviour } from './action/dandelionFluff'

export const dandelionFluffAI = function*(entity: Entity, world: World): Behaviour<void> {
  yield* dandelionFluffBehaviour(entity, world)
}
