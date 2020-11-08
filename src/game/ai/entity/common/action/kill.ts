import { Behaviour } from '@core/behaviour/behaviour'
import { World } from '@core/ecs/world'
import { Entity } from '@core/ecs/entity'

export const kill = function*(entity: Entity, world: World): Behaviour<void> {
  world.removeEntity(entity)
}
