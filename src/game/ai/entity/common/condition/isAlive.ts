import { Entity } from '@core/ecs/entity'

export const isAlive = (entity: Entity) => (): boolean => {
  const hp = entity.getComponent('Hp')
  return hp.hp > 0
}
