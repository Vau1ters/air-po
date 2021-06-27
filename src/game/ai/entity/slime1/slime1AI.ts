import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Behaviour } from '@core/behaviour/behaviour'
import { suspendable } from '@core/behaviour/suspendable'
import { isAlive } from '../common/condition/isAlive'
import { move, Direction } from '../common/action/move'
import { animate } from '../common/action/animate'
import { kill } from '../common/action/kill'
import { emitAir } from '../common/action/emitAir'
import { parallelAny } from '@core/behaviour/composite'
import { createSound } from '@game/entities/soundFactory'

const slime1Jump = function*(entity: Entity, world: World, direction: Direction): Behaviour<void> {
  createSound({ world, entity, name: 'slime4', options: { volume: 0.04 } })
  yield* parallelAny([
    animate({ entity, state: 'Jumping' }),
    move(entity, direction, 0.5, Infinity),
  ])
  yield* animate({ entity, state: 'Landing' })
}

const slime1Move = function*(entity: Entity, world: World): Behaviour<void> {
  while (true) {
    yield* animate({ entity, state: 'Idling', loopCount: 3 })
    for (let i = 0; i < 5; i++) yield* slime1Jump(entity, world, Direction.Right)
    yield* animate({ entity, state: 'Idling', loopCount: 3 })
    for (let i = 0; i < 5; i++) yield* slime1Jump(entity, world, Direction.Left)
  }
}

export const slime1AI = function*(entity: Entity, world: World): Behaviour<void> {
  yield* suspendable(isAlive(entity), slime1Move(entity, world))
  yield* emitAir(entity, world, 50)
  yield* animate({ entity, state: 'Dying' })
  yield* kill(entity, world)
}
