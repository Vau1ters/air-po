import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Behaviour } from '@core/behaviour/behaviour'
import { suspendable } from '@core/behaviour/suspendable'
import { isAlive } from '../common/condition/isAlive'
import { move, Direction } from '../common/action/move'
import { animate } from '../common/action/animate'
import { wait } from '@core/behaviour/wait'
import { kill } from '../common/action/kill'
import { emitAir } from '../common/action/emitAir'

const enemy1Move = function*(entity: Entity): Behaviour<void> {
  while (true) {
    yield* animate(entity, 'Idle')
    yield* wait(200)
    yield* animate(entity, 'Walk')
    yield* move(entity, Direction.Right, 0.3, 200)
    yield* animate(entity, 'Idle')
    yield* wait(200)
    yield* animate(entity, 'Walk')
    yield* move(entity, Direction.Left, 0.3, 200)
  }
}

export const enemy1AI = function*(entity: Entity, world: World): Behaviour<void> {
  yield* suspendable(isAlive(entity), enemy1Move(entity))
  yield* animate(entity, 'Dying')
  yield* wait(60)
  yield* emitAir(entity, world, 50)
  yield* kill(entity, world)
}
