import { Entity } from '../ecs/entity'
import { extendVine } from './action/extendVine'
import { parallel } from './composite/compositeBehaviour'
import { Behaviour } from './behaviour'

export const vineAI = function*(entity: Entity): Behaviour<void> {
  while (true) {
    yield* parallel([extendVine(entity)])
    yield
  }
}
