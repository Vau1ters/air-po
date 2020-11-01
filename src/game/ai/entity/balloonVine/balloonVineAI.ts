import { Entity } from '../../../../core/ecs/entity'
import { World } from '../../../../core/ecs/world'
import { Behaviour } from '../../../../core/behaviour/behaviour'
import { suspendable } from './decorator/suspendable'
import { parallel } from './composite/compositeBehaviour'
import { isAlive } from '../../../../core/ai/condition/isAlive'
import { animate } from '../../../../core/ai/action/animate'
import { kill } from '../../../../core/ai/action/kill'
import { emitAir } from '../../../../core/ai/action/emitAir'
import { hasAir } from '../../../../core/ai/condition/hasAir'
import { balloonVineBehaviour } from '../../../../core/ai/action/balloonVine'

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
