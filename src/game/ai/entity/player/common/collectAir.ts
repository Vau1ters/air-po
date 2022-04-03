import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { MouseController } from '@game/systems/controlSystem'

export const collectAir = function* (entity: Entity): Behaviour<void> {
  while (true) {
    entity.getComponent('AirHolder').collectSpeed = MouseController.isMousePressing('Right')
      ? 1
      : 0.125
    yield
  }
}
