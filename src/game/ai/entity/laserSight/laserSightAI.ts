import { windowSize } from '@core/application'
import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAll } from '@core/behaviour/composite'
import { CollisionResultRayAABB } from '@core/collision/collision/Ray_AABB'
import { Ray } from '@core/collision/geometry/ray'
import { Entity } from '@core/ecs/entity'
import { FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { INFINITY_COORDINATE } from '@core/math/constants'
import { Vec2 } from '@core/math/vec2'
import { CollisionCallbackArgs } from '@game/components/colliderComponent'
import { LaserSightLockFactory } from '@game/entities/laserSightLockFactory'
import { MouseController } from '@game/systems/controlSystem'
import { Graphics } from 'pixi.js'

type HitResult = {
  point: Vec2
  entity?: Entity
}

const getClosestHitGenerator = function*(
  player: Entity,
  laser: Entity
): Generator<HitResult, void> {
  const [collider] = laser.getComponent('Collider').colliders
  const ray = collider.geometry as Ray

  let hitInfo: Array<HitResult> = []
  collider.callbacks.add((args: CollisionCallbackArgs) => {
    const { other } = args
    const { hitPoint } = args as CollisionResultRayAABB
    if (other.entity === player) return
    hitInfo.push({ point: hitPoint, entity: other.entity })
  })

  while (true) {
    if (hitInfo.length > 0) {
      const closestHit = hitInfo.reduce((a, b) =>
        a.point.sub(ray.origin).length() < b.point.sub(ray.origin).length() ? a : b
      )
      hitInfo = []
      yield closestHit
    } else {
      yield { point: ray.origin.add(ray.direction.mul(INFINITY_COORDINATE)) }
    }
  }
}

type State = { lock: Lock | undefined }

type Lock = { lock: Entity; target: Entity; despawn: () => void }

const updateInvisibleRay = function*(laser: Entity, world: World): Behaviour<void> {
  const playerFamily = new FamilyBuilder(world).include('Player').build()
  const [collider] = laser.getComponent('Collider').colliders
  while (true) {
    const [player] = playerFamily.entityArray
    const mousePosition = MouseController.position
    const ray = collider.geometry as Ray
    const position = player.getComponent('Position')

    ray.origin = position
    ray.direction = mousePosition.sub(new Vec2(windowSize.width / 2, windowSize.height / 2))
    yield
  }
}

const updateVisibleRay = function*(laser: Entity, world: World, state: State): Behaviour<void> {
  const playerFamily = new FamilyBuilder(world).include('Player').build()
  const [g] = laser.getComponent('Draw').children as [Graphics]
  const targetPos = new Vec2()
  let chasing = 0
  while (true) {
    const [player] = playerFamily.entityArray
    const mousePosition = MouseController.position
    const start = player.getComponent('Position')

    if (state.lock) {
      targetPos.assign(state.lock.target.getComponent('Position'))
    }

    const end0 = start.add(mousePosition.sub(new Vec2(windowSize.width / 2, windowSize.height / 2)))
    const end1 = targetPos

    if (state.lock) {
      chasing = Math.min(chasing + 0.3, 1)
    } else {
      chasing = Math.max(chasing - 0.3, 0)
    }

    const end = end0.add(end1.sub(end0).mul(chasing))

    player.getComponent('Player').targetPosition = end

    g.clear()
    g.lineStyle(1, 0xff0000)
    g.moveTo(start.x, start.y)
    g.lineTo(end.x, end.y)
    g.beginFill(0xff0000)
    g.drawCircle(end.x, end.y, 2)
    yield
  }
}

const updateLock = function*(
  player: Entity,
  laser: Entity,
  world: World,
  state: State
): Behaviour<void> {
  const getClosestHit = getClosestHitGenerator(player, laser)
  const [collider] = laser.getComponent('Collider').colliders
  const ray = collider.geometry as Ray

  const isDistantEnough = (ray: Ray, entity: Entity): boolean => {
    return ray.distance(entity.getComponent('Position')) > 20
  }

  const spawnLock = (target: Entity): Lock => {
    let despawning = false
    const lock = new LaserSightLockFactory(target, () => despawning, world).create()
    world.addEntity(lock)
    return {
      lock,
      target,
      despawn: (): void => {
        despawning = true
      },
    }
  }

  for (const { entity } of getClosestHit) {
    if (state.lock) {
      if (
        isDistantEnough(ray, state.lock.target) ||
        state.lock.target.getComponent('HP').hp <= 0 ||
        MouseController.isMousePressing('Right')
      ) {
        state.lock.despawn()
        state.lock = undefined
      }
    } else {
      if (entity && entity.hasComponent('HP') && !MouseController.isMousePressing('Right')) {
        state.lock = spawnLock(entity)
      }
    }
    yield
  }
}

export const laserSightAI = (player: Entity, laser: Entity, world: World): Behaviour<void> => {
  const state: State = { lock: undefined }
  return parallelAll([
    updateVisibleRay(laser, world, state),
    updateInvisibleRay(laser, world),
    updateLock(player, laser, world, state),
  ])
}
