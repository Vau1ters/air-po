import { Entity } from '../../../ecs/entity'
import { changeVineLength } from './changeVineLength'
import { Behaviour } from '../../behaviour'
import { wait } from '../../wait'

export const vineAI = function*(entity: Entity): Behaviour<void> {
  while (true) {
    yield* changeVineLength(entity)
    yield* wait(2)
  }
}
