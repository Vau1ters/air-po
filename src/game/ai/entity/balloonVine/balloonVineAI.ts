import { Entity } from '../../../../core/ecs/entity'
import { World } from '../../../../core/ecs/world'
import { Behaviour } from '../../../../core/behaviour/behaviour'
import { suspendable } from '../../../../core/behaviour/suspendable'
import { parallel } from '../../../../core/behaviour/composite'
import { isAlive } from '../common/condition/isAlive'
import { animate } from '../common/action/animate'
import { kill } from '../common/action/kill'
import { emitAir } from '../common/action/emitAir'
import { hasAir } from '../common/condition/hasAir'
import { balloonVineBehaviour } from './balloonVine'

const changeState = function*(entity: Entity): Behaviour<void> {
  while (true) {
    if (hasAir(entity)()) {
      yield* animate(entity, 'Alive')
    } else {
      yield* animate(entity, 'Dead')
    }
    yield
  }
}

export const balloonvineAI = function*(entity: Entity, world: World): Behaviour<void> {
  yield* suspendable(
    isAlive(entity),
    parallel([balloonVineBehaviour(entity, world), changeState(entity)])
  )
  if (hasAir(entity)()) {
    yield* emitAir(entity, world, 40)
  }
  yield* kill(entity, world)
}
