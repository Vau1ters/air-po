import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Behaviour } from '@core/behaviour/behaviour'
import { suspendable } from '@core/behaviour/suspendable'
import { isAlive } from '../common/condition/isAlive'
import { move, Direction } from '../common/action/move'
import { animate, animateLoop } from '../common/action/animate'
import { kill } from '../common/action/kill'
import { emitAir } from '../common/action/emitAir'
import { parallelAny } from '@core/behaviour/composite'

const enemy1Move = function*(entity: Entity): Behaviour<void> {
  while (true) {
    yield* animateLoop(entity, 'Idle', 3)
    yield* parallelAny([animateLoop(entity, 'Walk'), move(entity, Direction.Right, 0.3, 200)])
    yield* animateLoop(entity, 'Idle', 3)
    yield* parallelAny([animateLoop(entity, 'Walk'), move(entity, Direction.Left, 0.3, 200)])
  }
}

export const enemy1AI = function*(entity: Entity, world: World): Behaviour<void> {
  yield* suspendable(isAlive(entity), enemy1Move(entity))
  entity.getComponent('Collider').removeByTag('AttackHitBox')
  yield* emitAir(entity, world, 50)
  yield* animate(entity, 'Dying')
  yield* kill(entity, world)
}
