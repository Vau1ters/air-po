import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Behaviour } from '@core/behaviour/behaviour'
import { suspendable } from '@core/behaviour/suspendable'
import { isAlive } from '../common/condition/isAlive'
import { move, MoveDirection } from '../common/action/move'
import { animate } from '../common/action/animate'
import { kill } from '../common/action/kill'
import { emitAir } from '../common/action/emitAir'
import { parallelAny } from '@core/behaviour/composite'

const slime1Jump = function* (entity: Entity, direction: MoveDirection): Behaviour<void> {
  entity.getComponent('Sound').addSound('slime4', { isRandomisePitch: true })
  yield* parallelAny([
    animate({ entity, state: 'Jumping' }),
    move({ entity, direction, speed: 0.5, duration: Infinity }),
  ])
  yield* animate({ entity, state: 'Landing' })
}

const slime1Move = function* (entity: Entity): Behaviour<void> {
  yield* animate({ entity, state: 'Idling', loopCount: Math.random() * 3 })
  while (true) {
    yield* animate({ entity, state: 'Idling', loopCount: 3 })
    for (let i = 0; i < 5; i++) yield* slime1Jump(entity, 'Right')
    yield* animate({ entity, state: 'Idling', loopCount: 3 })
    for (let i = 0; i < 5; i++) yield* slime1Jump(entity, 'Left')
  }
}

export const slime1AI = function* (entity: Entity, world: World): Behaviour<void> {
  yield* suspendable(isAlive(entity), slime1Move(entity))
  yield* emitAir(entity)
  yield* animate({ entity, state: 'Dying' })
  yield* kill(entity, world)
}
