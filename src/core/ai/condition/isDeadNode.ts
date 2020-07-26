import { Behaviour } from '../behaviourNode'
import { Entity } from '../../ecs/entity'
import { notNode } from './boolNode'
import { World } from '../../ecs/world'

export const isDeathNode = function*(entity: Entity): Behaviour {
  if (!entity.hasComponent('HP')) return 'Failure'
  const hpComponent = entity.getComponent('HP')
  if (hpComponent.hp > 0) return 'Failure'
  return 'Success'
}

export const isAliveNode = (entity: Entity, world: World): Behaviour =>
  notNode(isDeathNode)(entity, world)
