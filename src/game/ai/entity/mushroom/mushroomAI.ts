import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { animate } from '../common/action/animate'
import { hasAir } from '../common/condition/hasAir'

export const mushroomAI = function*(entity: Entity): Behaviour<void> {
  while (true) {
    if (hasAir(entity)()) {
      yield* animate(entity, 'Open')
    } else {
      yield* animate(entity, 'Close')
    }
    yield
  }
}
