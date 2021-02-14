import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'

export const JetEffectBehaviour = function*(entity: Entity, world: World): Behaviour<void> {
  let t = 0
  let v = 2

  while (true) {
    const draw = entity.getComponent('Draw')
    const pos = entity.getComponent('Position')
    v = Math.max(v - 0.5, 0)
    pos.y += v
    const s = draw.scale.x
    draw.scale.set(Math.max(0, s - 0.1))

    if (t > 100) world.removeEntity(entity)
    t++

    yield
  }
}
