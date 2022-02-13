import { Behaviour } from '@core/behaviour/behaviour'
import { wait } from '@core/behaviour/wait'
import { Entity } from '@core/ecs/entity'
import { PLAYER_FOOT_TAG } from '@game/entities/playerFactory'
import { assert } from '@utils/assertion'

export const land = function* (entity: Entity): Behaviour<void> {
  const player = entity.getComponent('Player')
  const rigidBody = entity.getComponent('RigidBody')

  const footCollider = entity.getComponent('Collider').getByTag(PLAYER_FOOT_TAG)
  assert(footCollider !== undefined, '')

  while (true) {
    const collisionResults = yield* wait.collision(footCollider, { allowNoCollision: true })
    player.landing = collisionResults.length > 0 && rigidBody.velocity.y > -1e-2
  }
}
