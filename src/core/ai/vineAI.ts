import { Entity } from '../ecs/entity'
import { World } from '../ecs/world'
import { extendVine } from './action/extendVine'
import { parallel } from './composite/compositeBehaviour'
import { Behaviour } from './behaviour'

export const vineAI = function*(entity: Entity, world: World): Behaviour<void> {
  while (true) {
    yield* parallel([extendVine(entity, world)])
    yield
  }
}
