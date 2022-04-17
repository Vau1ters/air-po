import { Behaviour } from '@core/behaviour/behaviour'
import { wait } from '@core/behaviour/wait'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { entitySetting } from '@game/entities/loader/entitySetting.autogen'
import GravitySystem from '@game/systems/gravitySystem'
import { assert } from '@utils/assertion'
import { emitAir } from '../common/action/emitAir'
import { kill } from '../common/action/kill'

export const AIR_NADE_VELOCITY = 220
export const AIR_NADE_LIFE = 60

const waitForCollision = function* (entity: Entity): Behaviour<void> {
  const collider = entity.getComponent('Collider').getByCategory('bullet')
  assert(collider !== undefined, 'collider not found')

  for (let i = 0; i < AIR_NADE_LIFE; i++) {
    const collisionResult = yield* wait.collision(collider, { allowNoCollision: true }) // not to consume more than 1 frame
    if (collisionResult.find(args => !args.other.entity.hasComponent('Player'))) {
      return
    }
  }
}

export const calcAirNadeThrowDirection = (targetPos: Vec2, throwerPos: Vec2): Vec2 => {
  // x = vx * t
  // y = vy * t + 0.5 * g * t * t
  // vx^2 + vy^2 = V^2

  // x^2 + (y - 0.5g * t^2)^2 = V^2t^2
  // (0.25g^2) t^4 + (-gy - V^2)t^2 + (x^2 + y^2) = 0

  const x = targetPos.x - throwerPos.x
  const y = targetPos.y - throwerPos.y
  const V = AIR_NADE_VELOCITY * AIR_NADE_VELOCITY
  const g = GravitySystem.acceleration * entitySetting.airNade.rigidBody.gravityScale

  const a = 0.25 * g * g
  const b = -(g * y + V)
  const c = x * x + y * y

  const det = b * b - 4 * a * c

  const t2 = (-b - Math.sqrt(Math.max(0, det))) / (2 * a)

  const t = Math.sqrt(Math.max(1e-7, t2))

  const vx = x / t
  const vy = y / t - 0.5 * g * t

  return new Vec2(vx, vy).normalize()
}

export const airNadeAI = function* (
  airNade: Entity,
  thrower: Entity,
  targetPos: Vec2,
  world: World
): Behaviour<void> {
  const pos = airNade.getComponent('Position')
  const rigidBody = airNade.getComponent('RigidBody')
  const dir = calcAirNadeThrowDirection(targetPos, pos)

  rigidBody.velocity = dir.mul(AIR_NADE_VELOCITY)

  yield* waitForCollision(airNade)
  yield* emitAir(airNade)
  yield* kill(airNade, world)
}
