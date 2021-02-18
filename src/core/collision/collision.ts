import { PositionComponent } from '@game/components/positionComponent'
import { AirFilter } from '@game/filters/airFilter'
import { assert } from '@utils/assertion'
import {
  AABBForCollision,
  AirForCollision,
  CircleForCollision,
  Collider,
  RayForCollision,
} from '@game/components/colliderComponent'
import { Vec2 } from '@core/math/vec2'
import { raycastToAABB } from './ray'

type WithHit<T> = { hit: false } | ({ hit: true } & T)

export type CollisionResultAABBAndAABB = {
  clip: number
}

const collideAABBAndAABB = (
  aabb1: AABBForCollision,
  aabb2: AABBForCollision
): WithHit<CollisionResultAABBAndAABB> => {
  if (!aabb1.bound.overlap(aabb2.bound)) return { hit: false }
  const center1 = aabb1.bound.center
  const center2 = aabb2.bound.center

  // めり込み量
  const clip = aabb1.bound.size
    .add(aabb2.bound.size)
    .div(2)
    .sub(center1.sub(center2).abs())

  // 四隅の浅い衝突も衝突していないことにする
  const tolerance = aabb1.maxClipToTolerance.add(aabb2.maxClipToTolerance)
  if (clip.x < tolerance.x && clip.y < tolerance.y) return { hit: false }
  return { hit: true, clip: Math.max(clip.x - tolerance.x, clip.y - tolerance.y) }
}

export type CollisionResultCircleAndAABB = {
  clip: number
}

const collideCircleAndAABB = (
  circle: CircleForCollision,
  aabb: AABBForCollision
): WithHit<CollisionResultCircleAndAABB> => {
  const distX = Math.max(
    0,
    aabb.bound.left - circle.circle.center.x,
    circle.circle.center.x - aabb.bound.right
  )
  const distY = Math.max(
    0,
    aabb.bound.top - circle.circle.center.y,
    circle.circle.center.y - aabb.bound.bottom
  )

  const dist2 = distX * distX + distY * distY
  const radius2 = circle.circle.radius * circle.circle.radius

  if (dist2 > radius2) return { hit: false }
  return { hit: true, clip: Math.sqrt(radius2) - Math.sqrt(dist2) }
}

export type CollisionResultCircleAndCircle = {
  clip: number
}

const collideCircleAndCircle = (
  c1: CircleForCollision,
  c2: CircleForCollision
): WithHit<CollisionResultCircleAndCircle> => {
  const dist2 = c1.circle.position.sub(c2.circle.position).lengthSq()
  const radius = c1.circle.radius + c2.circle.radius
  if (dist2 > radius * radius) return { hit: false }
  return { hit: true, clip: radius - Math.sqrt(dist2) }
}

export type CollisionResultAirAndAABB = {
  score: number
}

const collideAirAndAABB = (
  airs: AirForCollision,
  aabb: AABBForCollision
): WithHit<CollisionResultAirAndAABB> => {
  let score = 0
  for (const air of airs.family.entityIterator) {
    const airComponent = air.getComponent('Air')
    const pos = air.getComponent('Position')
    const r2 = airComponent.quantity * airComponent.quantity
    const d2 = pos.sub(aabb.bound.center).lengthSq()
    const R2 = AirFilter.EFFECTIVE_RADIUS * AirFilter.EFFECTIVE_RADIUS
    airComponent.hit = d2 < R2
    if (!airComponent.hit) continue
    score += Math.max(0, r2 * (1 / d2 - 1 / R2))
  }
  if (score <= 1) return { hit: false }
  return { hit: true, score }
}

export type CollisionResultRayAndAABB = {
  hitPoint: Vec2
}

const collideRayAndAABB = (
  ray: RayForCollision,
  aabb: AABBForCollision
): WithHit<CollisionResultRayAndAABB> => {
  const result = raycastToAABB(ray.ray, aabb.bound)
  if (result === undefined) return { hit: false }
  return { hit: true, hitPoint: result }
}

export type CollisionResult =
  | CollisionResultAABBAndAABB
  | CollisionResultCircleAndAABB
  | CollisionResultCircleAndCircle
  | CollisionResultAirAndAABB
  | CollisionResultRayAndAABB

export const collide = (
  c1: Collider,
  c2: Collider,
  position1: PositionComponent,
  position2: PositionComponent
): WithHit<CollisionResult> => {
  const g1 = c1.geometry.applyPosition(position1)
  const g2 = c2.geometry.applyPosition(position2)
  if (g1 instanceof AABBForCollision && g2 instanceof AABBForCollision) {
    return collideAABBAndAABB(g1, g2)
  } else if (g1 instanceof AABBForCollision && g2 instanceof CircleForCollision) {
    return collideCircleAndAABB(g2, g1)
  } else if (g1 instanceof CircleForCollision && g2 instanceof AABBForCollision) {
    return collideCircleAndAABB(g1, g2)
  } else if (g1 instanceof CircleForCollision && g2 instanceof CircleForCollision) {
    return collideCircleAndCircle(g1, g2)
  } else if (g1 instanceof AirForCollision && g2 instanceof AABBForCollision) {
    return collideAirAndAABB(g1, g2)
  } else if (g1 instanceof AABBForCollision && g2 instanceof AirForCollision) {
    return collideAirAndAABB(g2, g1)
  } else if (g1 instanceof RayForCollision && g2 instanceof AABBForCollision) {
    return collideRayAndAABB(g1, g2)
  } else if (g1 instanceof AABBForCollision && g2 instanceof RayForCollision) {
    return collideRayAndAABB(g2, g1)
  } else {
    assert(false, 'This collision is not implemented.')
  }
}
