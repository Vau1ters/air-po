import { Behaviour } from '../behaviour'
import { Entity } from '../../ecs/entity'

export const hasAir = function*(entity: Entity): Behaviour<boolean> {
  if (!entity.hasComponent('AirHolder')) return false
  const airHolderComponent = entity.getComponent('AirHolder')
  if (airHolderComponent.currentQuantity <= 0) {
    return false
  }
  return true
}
