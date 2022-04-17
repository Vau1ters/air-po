import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAll, parallelAny } from '@core/behaviour/composite'
import { wait } from '@core/behaviour/wait'
import { Entity } from '@core/ecs/entity'
import { Family } from '@core/ecs/family'
import { JumpAction } from '@game/movie/movie'
import { assert } from '@utils/assertion'
import { animate } from '../common/action/animate'
import { findActor } from './util'

const jump = function* (actor: Entity, speed: number): Behaviour<void> {
  const pos = actor.getComponent('Position')
  const rigidBody = actor.getComponent('RigidBody')
  const dir = actor.getComponent('HorizontalDirection')

  rigidBody.velocity.y -= 280

  while (true) {
    pos.x += speed * dir.sign
    yield
  }
}

export const jumpActionAI = function* (action: JumpAction, nameFamily: Family): Behaviour<void> {
  const actor = findActor(action.mover, nameFamily)
  const foot = actor.getComponent('Collider').getByTag('Foot')
  assert(foot !== undefined, 'foot tag not found')

  yield* parallelAll([
    animate({
      entity: actor,
      state: 'Jumping',
    }),
    parallelAny([jump(actor, 1), wait.collision(foot)]),
  ])
  yield* animate({
    entity: actor,
    state: 'Standing',
  })
}
