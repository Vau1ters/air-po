import { windowSize } from '@core/application'
import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAll } from '@core/behaviour/composite'
import { ease } from '@core/behaviour/easing/easing'
import { In, Out } from '@core/behaviour/easing/functions'
import { Segment } from '@core/collision/geometry/segment'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { LaserSightLockFactory } from '@game/entities/laserSightLockFactory'
import { SegmentSearcherFactory } from '@game/entities/segmentSearcherFactory'
import { MouseController } from '@game/systems/controlSystem'
import { getSingleton } from '@game/systems/singletonSystem'
import { assert } from '@utils/assertion'
import { Graphics } from 'pixi.js'
import { SegmentHitResult, segmentSearchGenerator } from '../segmentSearcher/segmentSearcherAI'

type Lock = { lock: Entity; despawn: () => void }
type LockingAimState = {
  state: 'Locking'
  target: Entity
  chasing: number
  hitResult: SegmentHitResult
}
type FreeAimState = {
  state: 'Free'
  hitResult: SegmentHitResult
}
type LaserSightState = LockingAimState | FreeAimState

const updateInvisibleSegment = function*(laser: Entity, world: World): Behaviour<void> {
  const [collider] = laser.getComponent('Collider').colliders
  while (true) {
    const player = getSingleton('Player', world)
    const camera = getSingleton('Camera', world)
    const mousePosition = MouseController.position
    const segment = collider.geometry as Segment
    const playerPosition = player.getComponent('Position')
    const cameraPosition = camera.getComponent('Position')
    const mousePositionOnScreen = mousePosition.sub(
      new Vec2(windowSize.width / 2, windowSize.height / 2)
    )
    const mousePositionOnWorld = cameraPosition.add(mousePositionOnScreen)

    const dir = mousePositionOnWorld.sub(playerPosition)

    const ts = [
      (cameraPosition.x - playerPosition.x - windowSize.width / 2) / dir.x,
      (cameraPosition.x - playerPosition.x + windowSize.width / 2) / dir.x,
      (cameraPosition.y - playerPosition.y - windowSize.height / 2) / dir.y,
      (cameraPosition.y - playerPosition.y + windowSize.height / 2) / dir.y,
    ]
    const t = Math.min(...ts.filter(t => t >= 0))

    segment.start = playerPosition
    segment.end = segment.start.add(dir.mul(t))
    yield
  }
}

const isDistantEnough = (segment: Segment, entity: Entity): boolean => {
  return segment.distance(entity.getComponent('Position')) > 20
}
const shouldLockEntity = (entity: Entity): boolean => {
  const isEntityAlive = entity.hasComponent('Hp') && entity.getComponent('Hp').hp > 0
  const canLock = entity.hasComponent('Hp') && entity.getComponent('Hp').canLock
  const isEntityCloseEnough = entity.getComponent('Draw').visible
  const forceFreeAiming = MouseController.isMousePressing('Right')

  return isEntityAlive && canLock && isEntityCloseEnough && !forceFreeAiming
}
const spawnLock = (target: Entity, world: World): Lock => {
  let despawning = false
  const lock = new LaserSightLockFactory(target, () => despawning, world).create()
  world.addEntity(lock)
  return {
    lock,
    despawn: (): void => {
      despawning = true
    },
  }
}

const getLaserSightStateGenerator = function*(
  player: Entity,
  laser: Entity,
  world: World
): Generator<LaserSightState, void> {
  const getClosestHit = segmentSearchGenerator(laser, {
    ignoreEntity: player,
    maximumDistance: 300,
  })
  const [collider] = laser.getComponent('Collider').colliders
  const segment = collider.geometry as Segment

  // ロックしている敵が実際に当たる位置にいるか確かめるためのレイ
  const lockingRay = new SegmentSearcherFactory()
    .addCategoryToMask('enemyHitbox', 'terrain')
    .create()
  world.addEntity(lockingRay)
  const getLockingEntityHit = segmentSearchGenerator(lockingRay, {
    ignoreEntity: player,
    maximumDistance: 300,
  })

  const freeAimGenerator = function*(state: FreeAimState): Behaviour<void> {
    while (true) {
      const { entity } = state.hitResult
      if (entity && shouldLockEntity(entity)) return

      yield
    }
  }

  const lockingAimGenerator = function*(entity: Entity, state: LockingAimState): Behaviour<void> {
    while (true) {
      const [lockingCollider] = lockingRay.getComponent('Collider').colliders
      const lockingSegment = lockingCollider.geometry as Segment
      lockingSegment.start = player.getComponent('Position')
      lockingSegment.end = entity.getComponent('Position')
      const { value } = getLockingEntityHit.next()
      assert(value instanceof Object, 'Unexpected Error')
      const { entity: firstHitEntity } = value

      const { entity: currentHittingEntity } = state.hitResult

      if (
        currentHittingEntity?.id !== entity.id && // 当たっているEntityが変わっていなければロックし続ける
        (firstHitEntity?.id !== entity.id || // ロックしているEntityとプレイヤーの間にオブジェクトがある
          isDistantEnough(segment, entity) ||
          !shouldLockEntity(entity))
      ) {
        return
      }

      yield
    }
  }
  const lockingAimWithEasingGenerator = function*(
    entity: Entity,
    state: LockingAimState
  ): Behaviour<void> {
    const easeOutChase = ease(Out.quad)(
      6,
      value => {
        state.chasing = value
      },
      {
        from: 0,
        to: 1,
      }
    )
    const easeInChase = ease(In.quad)(
      6,
      value => {
        state.chasing = value
      },
      {
        from: 1,
        to: 0,
      }
    )

    yield* easeOutChase
    yield* lockingAimGenerator(entity, state)
    yield* easeInChase
  }

  const hitResult: SegmentHitResult = {
    point: new Vec2(),
  }
  const assignHitResult = (): void => {
    const { value } = getClosestHit.next()
    assert(value instanceof Object, 'Unexpected Error')

    hitResult.entity = value.entity
    hitResult.point = value.point
  }

  while (true) {
    const freeAimState: FreeAimState = {
      state: 'Free',
      hitResult,
    }
    for (const _ of freeAimGenerator(freeAimState)) {
      assignHitResult()

      yield freeAimState
    }

    const { entity } = hitResult
    assert(entity, 'Unexpected Error')

    const lockingAimState: LockingAimState = {
      state: 'Locking',
      target: entity,
      chasing: 0,
      hitResult,
    }
    const lock = spawnLock(entity, world)

    for (const _ of lockingAimWithEasingGenerator(entity, lockingAimState)) {
      assignHitResult()

      yield lockingAimState
    }

    lock.despawn()
  }
}

const updateVisibleSegment = function*(laser: Entity, world: World): Behaviour<void> {
  const [g] = laser.getComponent('Draw').children as [Graphics]
  const player = getSingleton('Player', world)

  for (const state of getLaserSightStateGenerator(player, laser, world)) {
    const start = player.getComponent('Position')

    const end = state.hitResult.point.copy()
    if (state.state === 'Locking') {
      const end1 = state.target.getComponent('Position')

      end.assign(end.add(end1.sub(end).mul(state.chasing)))
    }

    player.getComponent('Player').targetPosition = end

    g.clear()
    g.lineStyle(1, 0xff0000, undefined, undefined, true)
    g.moveTo(start.x, start.y)
    g.lineTo(end.x, end.y)
    g.beginFill(0xff0000)
    g.drawCircle(end.x, end.y, 2)

    yield
  }
}

export const laserSightAI = (laser: Entity, world: World): Behaviour<void> => {
  return parallelAll([updateInvisibleSegment(laser, world), updateVisibleSegment(laser, world)])
}
