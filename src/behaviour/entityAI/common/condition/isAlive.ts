import { Entity } from '../../../../ecs/entity'

export const isAlive = (entity: Entity) => (): boolean => {
  const hpComponent = entity.getComponent('HP')
  if (hpComponent.hp > 0) return true
  return false
}
