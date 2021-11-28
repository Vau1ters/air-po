import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { MouseController } from '@game/systems/controlSystem'

export const emitAir = function*(entity: Entity): Behaviour<void> {
  entity.getComponent('AirHolder').emitSpeed = MouseController.isMousePressing('Left') ? 1 : 0
  yield
}
