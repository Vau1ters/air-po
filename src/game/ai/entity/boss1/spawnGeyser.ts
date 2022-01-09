import { wait } from '@core/behaviour/wait'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { Boss1GeyserFactory } from '@game/entities/boss1GeyserFactory'

export const spawnGeyser = function* (pos: Vec2, world: World): Generator<void, Entity> {
  const geyser = new Boss1GeyserFactory(pos, world).create()
  world.addEntity(geyser)
  yield* wait.frame(100)
  return geyser
}
