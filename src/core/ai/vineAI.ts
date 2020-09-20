import { Entity } from '../ecs/entity'
import { changeVineLength } from './action/changeVineLength'
import { parallel } from './composite/compositeBehaviour'
import { Behaviour } from './behaviour'
import { wait } from './action/wait'

export const vineAI = function*(entity: Entity): Behaviour<void> {
  while (true) {
    yield* parallel([changeVineLength(entity)])
    yield* wait(2)
  }
}
