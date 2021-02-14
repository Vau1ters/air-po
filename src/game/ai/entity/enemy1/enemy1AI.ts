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

const enemy1Walk = function*(entity: Entity, direction: Direction): Behaviour<void> {
  yield* parallelAny([animateLoop(entity, 'Walk'), move(entity, direction, 0.3, 200)])
}

const enemy1Move = function*(entity: Entity): Behaviour<void> {
  while (true) {
    yield* animateLoop(entity, 'Idle', 3)
    yield* enemy1Walk(entity, Direction.Right)
    yield* animateLoop(entity, 'Idle', 3)
    yield* enemy1Walk(entity, Direction.Left)
  }
}

export const enemy1AI = function*(entity: Entity, world: World): Behaviour<void> {
  yield* suspendable(isAlive(entity), enemy1Move(entity))
  entity.getComponent('Collider').removeByTag('AttackHitBox')
  yield* emitAir(entity, world, 50)
  yield* animate(entity, 'Dying')
  yield* kill(entity, world)
}
