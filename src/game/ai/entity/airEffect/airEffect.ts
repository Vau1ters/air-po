import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'

export const airEffectBehaviour = function*(entity: Entity): Behaviour<void> {
  function update(): void {
    const pos = entity.getComponent('Position')
    pos.y += 1
  }

  while (true) {
    update()
    yield
  }
}
