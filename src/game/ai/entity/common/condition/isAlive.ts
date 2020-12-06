import { Entity } from '@core/ecs/entity'

export const isAlive = (entity: Entity) => (): boolean => {
  const hp = entity.getComponent('HP')
  return hp.hp > 0
}
