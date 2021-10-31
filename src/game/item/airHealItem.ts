import { Entity } from '@core/ecs/entity'

export const useAirHealItem = (player: Entity): void => {
  const airHolder = player.getComponent('AirHolder')
  airHolder.collect(100)
}
