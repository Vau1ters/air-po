import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Behaviour } from '@core/behaviour/behaviour'
import { getSingleton } from '@game/systems/singletonSystem'
import { Vec2 } from '@core/math/vec2'

const chase = function* (entity: Entity, world: World): Behaviour<void> {
  const player = getSingleton('Player', world)
  const pos = entity.getComponent('Position')
  pos.assign(player.getComponent('Position'))

  while (true) {
    const destinations = [-1, +1].map(sign =>
      player.getComponent('Position').add(new Vec2(sign * 16, -8))
    )
    const destination = destinations.reduce((a, b) =>
      pos.sub(a).lengthSq() < pos.sub(b).lengthSq() ? a : b
    )

    pos.assign(Vec2.mix(pos, destination, 0.04))
    yield
  }
}

export const droneAI = function* (entity: Entity, world: World): Behaviour<void> {
  yield* chase(entity, world)
}
