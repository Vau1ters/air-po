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

const slime1Move = function*(entity: Entity): Behaviour<void> {
  while (true) {
    for (let i = 0; i < 3; i++) yield* animate(entity, 'Idle', 0.1)
    yield* parallelAny([animateLoop(entity, 'Walk', 0.15), move(entity, Direction.Right, 0.3, 200)])
    for (let i = 0; i < 3; i++) yield* animate(entity, 'Idle', 0.1)
    yield* parallelAny([animateLoop(entity, 'Walk', 0.15), move(entity, Direction.Left, 0.3, 200)])
  }
}

export const slime1AI = function*(entity: Entity, world: World): Behaviour<void> {
  yield* suspendable(isAlive(entity), slime1Move(entity))
  entity.getComponent('Collider').removeByTag('AttackHitBox')
  yield* emitAir(entity, world, 50)
  yield* animate(entity, 'Dying', 0.2)
  yield* kill(entity, world)
}
