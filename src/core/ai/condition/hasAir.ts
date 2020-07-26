import { Behaviour } from '../behaviour'
import { Entity } from '../../ecs/entity'

export const hasAir = function*(entity: Entity): Behaviour<boolean> {
  const airHolderComponent = entity.getComponent('AirHolder')
  if (airHolderComponent.currentQuantity > 0) return true
  return false
}
