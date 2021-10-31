import { Entity } from '@core/ecs/entity'
import { changeVineLength } from './changeVineLength'
import { Behaviour } from '@core/behaviour/behaviour'
import { wait } from '@core/behaviour/wait'

export const vineAI = function*(entity: Entity): Behaviour<void> {
  while (true) {
    yield* changeVineLength(entity)
    yield* wait.frame(2)
  }
}
