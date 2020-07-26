import { Behaviour } from '../behaviourNode'
import { World } from '../../ecs/world'
import { Entity } from '../../ecs/entity'

export const deathNode = function*(entity: Entity, world: World): Behaviour {
  world.removeEntity(entity)
  return 'Success'
}
