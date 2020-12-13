import { Entity } from '@core/ecs/entity'

export const hasAir = (entity: Entity) => (): boolean => {
  const airHolderComponent = entity.getComponent('AirHolder')
  if (airHolderComponent.quantity > 0) return true
  return false
}
