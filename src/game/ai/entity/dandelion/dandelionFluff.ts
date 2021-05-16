import { Entity } from '@core/ecs/entity'
import { FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { Behaviour } from '@core/behaviour/behaviour'
import { Vec2 } from '@core/math/vec2'
import { animate } from '../common/action/animate'

const INITIAL_VELOCITY = new Vec2(1, 2)
const BUOYANCY = 0.005
const RESISTANCE = 0.01
const OPEN_WAIT_FRAME = 5
const ROTATE_WAIT_FRAME = 2

export const dandelionFluffBehaviour = function*(entity: Entity, world: World): Behaviour<void> {
  const player = new FamilyBuilder(world)
    .include('Player')
    .build()
    .entityArray[0].getComponent('Player')
  const position = entity.getComponent('Position')

  const velocity = INITIAL_VELOCITY.copy()

  while (true) {
    velocity.y -= BUOYANCY
    velocity.x *= 1 - RESISTANCE
    velocity.y *= 1 - RESISTANCE
    position.x += velocity.x
    position.y += velocity.y

    if (position.y < 0) {
      world.removeEntity(entity)
      if (player.possessingEntity === entity) {
        player.possessingEntity = undefined
      }
      break
    }
    yield
  }
}

export const dandelionAnimation = function*(entity: Entity): Behaviour<void> {
  yield* animate({ entity, state: 'Open' })
  for (let i = OPEN_WAIT_FRAME; i >= ROTATE_WAIT_FRAME; i--) {
    yield* animate({ entity, state: 'Rotate', loopCount: OPEN_WAIT_FRAME - i + 1, waitFrames: i })
  }
  yield* animate({ entity, state: 'Rotate', loopCount: Infinity })
}
