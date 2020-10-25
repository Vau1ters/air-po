import { Entity } from '../../../ecs/entity'
import { World } from '../../../ecs/world'
import { Behaviour } from '../../behaviour'
import { suspendable } from '../../suspendable'
import { isAlive } from '../common/condition/isAlive'
import { move, Direction } from '../common/action/move'
import { animate } from '../common/action/animate'
import { wait } from '../../wait'
import { kill } from '../common/action/kill'
import { emitAir } from '../common/action/emitAir'

const enemy1Move = function*(entity: Entity): Behaviour<void> {
  while (true) {
    yield* move(entity, Direction.Right, 2, 60)
    yield* move(entity, Direction.Left, 2, 60)
  }
}

export const enemy1AI = function*(entity: Entity, world: World): Behaviour<void> {
  yield* suspendable(isAlive(entity), enemy1Move(entity))
  yield* animate(entity, 'Dying')
  yield* wait(60)
  yield* emitAir(entity, world, 50)
  yield* kill(entity, world)
}
