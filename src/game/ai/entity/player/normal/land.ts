import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { CollisionCallbackArgs } from '@game/components/colliderComponent'
import { PLAYER_FOOT_TAG } from '@game/entities/playerFactory'

const footCollisionCallback = (args: CollisionCallbackArgs): void => {
  const {
    me: { entity: playerEntity },
  } = args
  const rigidBody = playerEntity.getComponent('RigidBody')
  if (rigidBody.velocity.y < -1e-2) return

  const player = playerEntity.getComponent('Player')
  player.landing = true
}

export const land = function*(entity: Entity): Behaviour<void> {
  const player = entity.getComponent('Player')

  const footCollider = entity
    .getComponent('Collider')
    .colliders.find(c => c.tag.has(PLAYER_FOOT_TAG))
  footCollider?.callbacks.add(footCollisionCallback)

  while (true) {
    player.landing = false
    yield
  }
}
