import { Entity } from '../../ecs/entity'
import { FamilyBuilder } from '../../ecs/family'
import { World } from '../../ecs/world'
import { Behaviour } from '../../behaviour/behaviour'
import { Vec2 } from '../../math/vec2'

const INITIAL_VELOCITY = new Vec2(1, 2)
const BUOYANCY = 0.005
const RESISTANCE = 0.01

export const dandelionFluffBehaviour = function*(entity: Entity, world: World): Behaviour<void> {
  const player = new FamilyBuilder(world)
    .include('Player')
    .build()
    .entityArray[0].getComponent('Player')
  const position = entity.getComponent('Position')

  const velocity = INITIAL_VELOCITY.copy()

  while (true) {
    velocity.y -= BUOYANCY
    velocity.x *= 1 - RESISTANCE
    velocity.y *= 1 - RESISTANCE
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
