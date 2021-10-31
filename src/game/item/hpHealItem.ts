import { Entity } from '@core/ecs/entity'

export const useHpHealItem = (player: Entity): void => {
  const hp = player.getComponent('Hp')
  hp.increase(1)
}
