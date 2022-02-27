import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAny } from '@core/behaviour/composite'
import { ease } from '@core/behaviour/easing/easing'
import { InOut } from '@core/behaviour/easing/functions'
import { wait } from '@core/behaviour/wait'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { getSingleton } from '@game/systems/singletonSystem'
import { animate } from '../common/action/animate'
import { kill } from '../common/action/kill'

const coinGetEffectMovement = function* (
  entity: Entity,
  world: World,
  index: number
): Behaviour<void> {
  const player = getSingleton('Player', world)
  const initialSpeed = 3
  const a = Math.random() * Math.PI * 2
  let vel = new Vec2(Math.cos(a), Math.sin(a)).mul(initialSpeed)
  const pos = entity.getComponent('Position')
  for (let i = 0; i < 30; i++) {
    const v = Math.max(0.1, vel.length() * 0.9)
    vel = vel.mul(v / vel.length())
    pos.assign(pos.add(vel))
    yield
  }
  yield* wait.frame(index * 3)
  yield* ease(InOut.quad)(30, (value: number) => {
    pos.assign(Vec2.mix(pos, player.getComponent('Position'), value))
  })
}

export const coinGetEffectAI = function* (
  entity: Entity,
  world: World,
  index: number
): Behaviour<void> {
  yield* parallelAny([
    coinGetEffectMovement(entity, world, index),
    animate({ entity, state: 'Normal', loopCount: 1, waitFrames: 120 / 4 }),
  ])
  yield* kill(entity, world)
}
