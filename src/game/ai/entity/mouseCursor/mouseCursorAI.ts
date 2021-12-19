import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { MouseController } from '@game/systems/controlSystem'

export const mouseCursorAI = function* (entity: Entity): Behaviour<void> {
  while (true) {
    const mousePosition = MouseController.position
    entity.getComponent('Position').assign(mousePosition)
    yield
  }
}
