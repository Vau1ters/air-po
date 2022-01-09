import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'

export const emitAir = function* (entity: Entity, quantity?: number): Behaviour<void> {
  const airHolder = entity.getComponent('AirHolder')
  airHolder.emitSpeed = quantity ?? airHolder.quantity
  yield
  airHolder.emitSpeed = 0
}
