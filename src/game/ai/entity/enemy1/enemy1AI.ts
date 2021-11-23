import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Behaviour } from '@core/behaviour/behaviour'
import { suspendable } from '@core/behaviour/suspendable'
import { isAlive } from '../common/condition/isAlive'
import { animate } from '../common/action/animate'
import { kill } from '../common/action/kill'
import { emitAir } from '../common/action/emitAir'
import { parallelAny } from '@core/behaviour/composite'
import { move, MoveDirection } from '../common/action/move'

const enemy1Walk = function*(entity: Entity, direction: MoveDirection): Behaviour<void> {
  yield* parallelAny([
    animate({ entity, state: 'Walk', loopCount: Infinity }),
    move({ entity, direction, speed: 0.3, duration: 200 }),
  ])
}

const enemy1Move = function*(entity: Entity): Behaviour<void> {
  while (true) {
    yield* animate({ entity, state: 'Idle', loopCount: 3 })
    yield* enemy1Walk(entity, 'Right')
    yield* animate({ entity, state: 'Idle', loopCount: 3 })
    yield* enemy1Walk(entity, 'Left')
  }
}

export const enemy1AI = function*(entity: Entity, world: World): Behaviour<void> {
  yield* suspendable(isAlive(entity), enemy1Move(entity))
  yield* emitAir(entity, world, 50)
  yield* animate({ entity, state: 'Dying' })
  yield* kill(entity, world)
}
