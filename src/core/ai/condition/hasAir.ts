import { Entity } from '../../ecs/entity'

export const hasAir = (entity: Entity) => (): boolean => {
  const airHolderComponent = entity.getComponent('AirHolder')
  if (airHolderComponent.currentQuantity > 0) return true
  return false
}
