import { Behaviour } from '../../behaviour/behaviour'
import { World } from '../../ecs/world'
import { Entity } from '../../ecs/entity'

export const kill = function*(entity: Entity, world: World): Behaviour<void> {
  world.removeEntity(entity)
}
