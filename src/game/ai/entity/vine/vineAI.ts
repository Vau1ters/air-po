import { Entity } from '../ecs/entity'
import { changeVineLength } from './action/changeVineLength'
import { Behaviour } from '../behaviour/behaviour'
import { wait } from './action/wait'

export const vineAI = function*(entity: Entity): Behaviour<void> {
  while (true) {
    yield* changeVineLength(entity)
    yield* wait(2)
  }
}
