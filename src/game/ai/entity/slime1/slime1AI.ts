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

const slime1Jump = function*(entity: Entity, direction: Direction): Behaviour<void> {
  yield* parallelAny([animate(entity, 'Jumping'), move(entity, direction, 0.5, Infinity)])
  yield* animate(entity, 'Landing')
}

const slime1Move = function*(entity: Entity): Behaviour<void> {
  while (true) {
    yield* animateLoop(entity, 'Idling', 3)
    for (let i = 0; i < 5; i++) yield* slime1Jump(entity, Direction.Right)
    yield* animateLoop(entity, 'Idling', 3)
    for (let i = 0; i < 5; i++) yield* slime1Jump(entity, Direction.Left)
  }
}

export const slime1AI = function*(entity: Entity, world: World): Behaviour<void> {
  yield* suspendable(isAlive(entity), slime1Move(entity))
  yield* emitAir(entity, world, 50)
  yield* animate(entity, 'Dying')
  yield* kill(entity, world)
}
