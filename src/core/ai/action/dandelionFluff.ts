import { Entity } from '../../ecs/entity'
import { FamilyBuilder } from '../../ecs/family'
import { World } from '../../ecs/world'
import { Behaviour } from '../behaviour'
import { Vec2 } from '../../math/vec2'

export const dandelionFluffBehaviour = function*(entity: Entity, world: World): Behaviour<void> {
  const player = new FamilyBuilder(world)
    .include('Player')
    .build()
    .entityArray[0].getComponent('Player')
  const position = entity.getComponent('Position')

  const velocity = new Vec2(1, 2)

  while (true) {
    velocity.y -= 0.005
    velocity.x *= 0.99
    velocity.y *= 0.99
    position.x += velocity.x
    position.y += velocity.y

    if (position.y < 0) {
      world.removeEntity(entity)
      if (player.possessingEntity === entity) {
        player.possessingEntity = undefined
      }
      break
    }
    yield
  }
}
