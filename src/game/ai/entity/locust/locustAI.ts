import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Behaviour } from '@core/behaviour/behaviour'
import { suspendable } from '@core/behaviour/suspendable'
import { isAlive } from '../common/condition/isAlive'
import { kill } from '../common/action/kill'
import { emitAir } from '../common/action/emitAir'
import { wait } from '@core/behaviour/wait'
import { jump, JumpOption } from '../common/action/jump'
import { CollisionResultAABBAABB } from '@core/collision/collision/AABB_AABB'
import { getSingleton } from '@game/systems/singletonSystem'
import { assert } from '@utils/assertion'
import { getCollisionResult } from '../common/action/collision'
import { parallelAll } from '@core/behaviour/composite'
import { Vec2 } from '@core/math/vec2'
import GravitySystem from '@game/systems/gravitySystem'

type LocustAction = 'JumpLeft' | 'JumpRight' | 'ChasePlayer'

const decideAction = function*(locust: Entity, player: Entity): Behaviour<LocustAction> {
  const collider = locust.getComponent('Collider')
  const wallSensor = collider.getByTag('LocustWallSensor')
  const playerSensor = collider.getByTag('LocustPlayerSensor')
  assert(wallSensor !== undefined, '')
  assert(playerSensor !== undefined, '')

  const [wallCollisionResults, playerCollisionoResults] = yield* parallelAll([
    getCollisionResult(wallSensor),
    getCollisionResult(playerSensor),
  ])
  const foundLeftWall = wallCollisionResults.find(
    result => (result as CollisionResultAABBAABB).axis.x === -1
  )
  const foundRightWall = wallCollisionResults.find(
    result => (result as CollisionResultAABBAABB).axis.x === 1
  )
  const foundPlayer = playerCollisionoResults.length > 0

  if (foundPlayer) {
    const locustPos = locust.getComponent('Position')
    const playerPos = player.getComponent('Position')
    if (playerPos.x < locustPos.x && !foundLeftWall) {
      return 'ChasePlayer'
    }
    if (locustPos.x < playerPos.x && !foundRightWall) {
      return 'ChasePlayer'
    }
  }
  if (foundLeftWall && !foundRightWall) {
    return 'JumpRight'
  }
  if (!foundLeftWall && foundRightWall) {
    return 'JumpLeft'
  }
  return Math.random() < 0.5 ? 'JumpLeft' : 'JumpRight'
}

const calcJumpVelocity = (
  gravityScale: number,
  startPos: Vec2,
  endPos: Vec2
): { canReach: false } | { canReach: true; velocity: Vec2 } => {
  const velocityLimit = { min: 100, max: 400 }
  const accelY = GravitySystem.acceleration * gravityScale
  const deltaPos = endPos.sub(startPos)
  const requiredVelY = Math.sqrt(Math.max(0, -2 * accelY * deltaPos.y))
  if (velocityLimit.max < requiredVelY) return { canReach: false }
  velocityLimit.min = requiredVelY
  const velY = -(velocityLimit.min + Math.random() * (velocityLimit.max - velocityLimit.min))
  const t = (-velY + Math.sqrt(velY * velY + 2 * accelY * deltaPos.y)) / accelY
  const velX = (endPos.x - startPos.x) / t
  if (Math.abs(velX) < velocityLimit.min) return { canReach: false }
  if (Math.abs(velX) > velocityLimit.max) return { canReach: false }
  return { canReach: true, velocity: new Vec2(velX, velY) }
}

const calcJumpOption = (locust: Entity, player: Entity, action: LocustAction): JumpOption => {
  const jumpOption = {
    entity: locust,
    footTag: 'LocustFootSensor',
  }
  switch (action) {
    case 'JumpLeft':
      return {
        ...jumpOption,
        direction: 'Left',
        upSpeed: 300,
        forwardSpeed: 100,
      }
    case 'JumpRight':
      return {
        ...jumpOption,
        direction: 'Right',
        upSpeed: 300,
        forwardSpeed: 100,
      }
    case 'ChasePlayer': {
      const locustPos = locust.getComponent('Position')
      const playerPos = player.getComponent('Position')
      const vel = calcJumpVelocity(
        locust.getComponent('RigidBody').gravityScale,
        locustPos,
        playerPos
      )
      if (vel.canReach) {
        const { velocity } = vel
        return {
          ...jumpOption,
          direction: velocity.x < 0 ? 'Left' : 'Right',
          upSpeed: -velocity.y,
          forwardSpeed: Math.abs(velocity.x),
        }
      } else {
        return {
          ...jumpOption,
          direction: playerPos.x < locustPos.x ? 'Left' : 'Right',
          upSpeed: 100,
          forwardSpeed: 100,
        }
      }
    }
  }
}

const locustJump = function*(locust: Entity, player: Entity): Behaviour<void> {
  const sound = locust.getComponent('Sound')
  const action = yield* decideAction(locust, player)
  const option = calcJumpOption(locust, player, action)
  yield* wait.frame(10)
  sound.addSound('foot1')
  yield* jump(option)
}

const locustMove = function*(locust: Entity, player: Entity): Behaviour<void> {
  yield* wait.frame(Math.random() * 60)
  while (true) {
    yield* wait.frame(60)
    yield* locustJump(locust, player)
  }
}

export const locustAI = function*(locust: Entity, world: World): Behaviour<void> {
  const player = getSingleton('Player', world)
  yield* suspendable(isAlive(locust), locustMove(locust, player))
  yield* emitAir(locust, world, 50)
  yield* kill(locust, world)
}
