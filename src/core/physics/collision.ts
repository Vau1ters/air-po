import {
  AABBCollider,
  Collider,
  CircleCollider,
  AirCollider,
} from '../components/colliderComponent'
import { PositionComponent } from '../components/positionComponent'
import { Circle } from '../math/circle'
import { AABB } from '../math/aabb'
import { AirFilter } from '../../filters/airFilter'
import { Entity } from '../ecs/entity'
import { assert } from '../../utils/assertion'
import { AirComponent } from '../components/airComponent'

const collideCircleAndAABB = (circle: Circle, aabb: AABB): boolean => {
  const distX = Math.max(
    0,
    aabb.left - circle.center.x,
    circle.center.x - aabb.right
  )
  const distY = Math.max(
    0,
    aabb.top - circle.center.y,
    circle.center.y - aabb.bottom
  )

  return distX * distX + distY * distY < circle.radius * circle.radius
}

const collideAirAndAABB = (airs: Set<Entity>, aabb: AABB): boolean => {
  let score = 0
  for (const air of airs) {
    const airComponent = air.getComponent('Air') as AirComponent
    const pos = air.getComponent('Position') as PositionComponent
    const r2 = airComponent.quantity
    const d2 = pos.sub(aabb.center).lengthSq()
    const R2 = AirFilter.EFFECTIVE_RADIUS * AirFilter.EFFECTIVE_RADIUS
    airComponent.hit = d2 < R2
    if (!airComponent.hit) continue
    score += Math.max(0, r2 * (1 / d2 - 1 / R2))
  }
  return score > 1
}

export const collide = (
  c1: Collider,
  c2: Collider,
  position1: PositionComponent,
  position2: PositionComponent
): boolean => {
  if (c1 instanceof AABBCollider && c2 instanceof AABBCollider) {
    const aabb1 = c1.aabb.add(position1)
    const aabb2 = c2.aabb.add(position2)
    if (aabb1.overlap(aabb2)) {
      const center1 = aabb1.center
      const center2 = aabb2.center

      // めり込み量
      const clip = aabb1.size
        .add(aabb2.size)
        .div(2)
        .sub(center1.sub(center2).abs())

      // 四隅の浅い衝突も衝突していないことにする
      const tolerance = c1.maxClipTolerance.add(c2.maxClipTolerance)
      if (clip.x < tolerance.x && clip.y < tolerance.y) return false
      return true
    }
    return false
  } else if (c1 instanceof AABBCollider && c2 instanceof CircleCollider) {
    const aabb = c1.aabb.add(position1)
    const circle = c2.circle.add(position2)
    return collideCircleAndAABB(circle, aabb)
  } else if (c1 instanceof CircleCollider && c2 instanceof AABBCollider) {
    const circle = c1.circle.add(position1)
    const aabb = c2.aabb.add(position2)
    return collideCircleAndAABB(circle, aabb)
  } else if (c1 instanceof CircleCollider && c2 instanceof CircleCollider) {
    const circle1 = c1.circle.add(position1)
    const circle2 = c2.circle.add(position2)
    return circle1.overlap(circle2)
  } else if (c1 instanceof AirCollider && c2 instanceof AABBCollider) {
    const air = c1.airFamily.entities
    const aabb = c2.aabb.add(position2)
    return collideAirAndAABB(air, aabb)
  } else if (c1 instanceof AABBCollider && c2 instanceof AirCollider) {
    const air = c2.airFamily.entities
    const aabb = c1.aabb.add(position1)
    return collideAirAndAABB(air, aabb)
  } else {
    assert(false)
  }
}
