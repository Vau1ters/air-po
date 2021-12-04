import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { CollisionCallbackArgs } from '@game/components/colliderComponent'
import { PLAYER_FOOT_TAG } from '@game/entities/playerFactory'
import { assert } from '@utils/assertion'

const footCollisionCallback = (args: CollisionCallbackArgs): void => {
  const {
    me: { entity: playerEntity },
  } = args
  const rigidBody = playerEntity.getComponent('RigidBody')
  if (rigidBody.velocity.y < -1e-2) return

  const player = playerEntity.getComponent('Player')
  assert('axis' in args, '')
  const axisLen = args.axis.length()
  const normal = axisLen === 0 ? new Vec2(0, -1) : args.axis.div(-axisLen)
  player.ground = { landing: true, normal }
}

export const land = function*(entity: Entity): Behaviour<void> {
  const player = entity.getComponent('Player')

  const footCollider = entity
    .getComponent('Collider')
    .colliders.find(c => c.tag.has(PLAYER_FOOT_TAG))
  footCollider?.callbacks.add(footCollisionCallback)

  while (true) {
    player.ground = { landing: false }
    yield
  }
}
