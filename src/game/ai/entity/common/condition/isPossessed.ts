import { Entity } from '@core/ecs/entity'

export const isPossessed = (entity: Entity) => (): boolean => {
  const target = entity.getComponent('PickupTarget')
  return target.isPossessed
}
