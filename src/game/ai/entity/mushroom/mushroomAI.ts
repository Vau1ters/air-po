import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { animate } from '../common/action/animate'
import { hasAir } from '../common/condition/hasAir'
import { SporeEffectFactory } from '@game/entities/effect/sporeEffectFactory'
import { Vec2 } from '@core/math/vec2'
import { World } from '@core/ecs/world'

export const mushroomAI = function*(entity: Entity, world: World): Behaviour<void> {
  let opened = false
  const position = entity.getComponent('Position')
  const sporeFactory = new SporeEffectFactory(world)
  while (true) {
    if (hasAir(entity)()) {
      const mushroom = entity.getComponent('Mushroom')
      if (mushroom.landed) {
        yield* animate({ entity, state: 'Landed', waitFrames: 5 })
        mushroom.landed = false
      } else if (opened) {
        yield* animate({ entity, state: 'Open' })
      } else {
        for (let i = 0; i < 10; i++) {
          sporeFactory.setPosition(
            position.add(new Vec2(Math.random() * 5 - 30 + i * 6, Math.random() * 5 + 13))
          )
          world.addEntity(sporeFactory.create())
        }
        yield* animate({ entity, state: 'Opening', waitFrames: 5 })
        opened = true
      }
    } else {
      yield* animate({ entity, state: 'Close' })
    }
    yield
  }
}
