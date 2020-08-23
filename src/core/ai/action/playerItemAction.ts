import { Behaviour } from '../behaviour'
import { Entity } from '../../ecs/entity'
import { Vec2 } from '../../math/vec2'

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
          const pos = fluffPosition.add(new Vec2(0, 8))
          playerPosition.x += (pos.x - playerPosition.x) * 0.5
          playerPosition.y += (pos.y - playerPosition.y) * 0.5
          fluffPosition.x += playerBody.velocity.x * 0.003

          yield
          if (player.possessingEntity === undefined) break
          if (playerPosition.sub(pos).length() > 10) break
        }
        player.possessingEntity = undefined
      }
    } else {
      playerBody.gravityScale = 1 // to reset change of gravityScale by fluff
    }
    yield
  }
}
