import { Behaviour } from '../behaviour'
import { Entity } from '../../ecs/entity'
import { Vec2 } from '../../math/vec2'

const FLUFF_GRUB_POSITION = new Vec2(0, 0.8)
const PLAYER_TO_FLUFF_VELOCITY_CONTRIBUTION = 0.003
const FLUFF_STICK_SCALE = 0.5
const FLUFF_RELEASE_DISTANCE = 10

export const playerItemAction = function*(entity: Entity): Behaviour<void> {
  const player = entity.getComponent('Player')
  const playerPosition = entity.getComponent('Position')
  const playerBody = entity.getComponent('RigidBody')

  while (true) {
    if (player.possessingEntity !== undefined) {
      if (player.possessingEntity.getComponent('Collider').colliders[0].tag.has('fluff')) {
        const fluff = player.possessingEntity
        const fluffPosition = fluff.getComponent('Position')
        playerBody.gravityScale = 0
        playerBody.velocity.x = 0
        playerBody.velocity.y = 0
        while (true) {
          const pos = fluffPosition.add(FLUFF_GRUB_POSITION)
          playerPosition.x += (pos.x - playerPosition.x) * FLUFF_STICK_SCALE
          playerPosition.y += (pos.y - playerPosition.y) * FLUFF_STICK_SCALE
          fluffPosition.x += playerBody.velocity.x * PLAYER_TO_FLUFF_VELOCITY_CONTRIBUTION

          yield
          if (player.possessingEntity === undefined) break
          if (playerPosition.sub(pos).length() > FLUFF_RELEASE_DISTANCE) break
        }
        player.possessingEntity = undefined
      }
    } else {
      playerBody.gravityScale = 1 // to reset change of gravityScale by fluff
    }
    yield
  }
}
