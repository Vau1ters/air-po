import { Entity } from '../../ecs/entity'

export const isPossessed = (entity: Entity) => (): boolean => {
  const target = entity.getComponent('PickupTarget')
  return target.isPossessed
}
