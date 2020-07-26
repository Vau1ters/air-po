import { Behaviour } from '../behaviour'
import { Entity } from '../../ecs/entity'

export const isAlive = function*(entity: Entity): Behaviour<boolean> {
  if (!entity.hasComponent('HP')) return false
  const hpComponent = entity.getComponent('HP')
  if (hpComponent.hp > 0) return true
  return false
}
