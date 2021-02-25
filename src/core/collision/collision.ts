import { Collider } from '@game/components/colliderComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { assert } from '@utils/assertion'
import { CollisionResultAABBAABB, collideAABBAABB } from './collision/AABB_AABB'
import { CollisionResultAirAABB, collideAirAABB } from './collision/Air_AABB'
import { CollisionResultCircleAABB, collideCircleAABB } from './collision/Circle_AABB'
import { CollisionResultCircleCircle, collideCircleCircle } from './collision/Circle_Circle'
import { CollisionResultOBBOBB, collideOBBOBB } from './collision/OBB_OBB'
import { CollisionResultRayAABB, collideRayAABB } from './collision/Ray_AABB'
import { AABB } from './geometry/aabb'
import { Air } from './geometry/air'
import { Circle } from './geometry/circle'
import { OBB } from './geometry/obb'
import { Ray } from './geometry/ray'

export type WithHit<T> = { hit: false } | ({ hit: true } & T)

export type CollisionResult =
  | CollisionResultAABBAABB
  | CollisionResultOBBOBB
  | CollisionResultCircleAABB
  | CollisionResultCircleCircle
  | CollisionResultAirAABB
  | CollisionResultRayAABB

export const collide = (
  c1: Collider,
  c2: Collider,
  position1: PositionComponent,
  position2: PositionComponent
): WithHit<CollisionResult> => {
  const g1 = c1.geometry.applyPosition(position1)
  const g2 = c2.geometry.applyPosition(position2)
  if (g1 instanceof AABB && g2 instanceof AABB) {
    return collideAABBAABB(g1, g2)
  } else if (g1 instanceof AABB && g2 instanceof OBB) {
    return collideOBBOBB(g1.asOBB(), g2)
  } else if (g1 instanceof OBB && g2 instanceof AABB) {
    return collideOBBOBB(g1, g2.asOBB())
  } else if (g1 instanceof OBB && g2 instanceof OBB) {
    return collideOBBOBB(g1, g2)
  } else if (g1 instanceof AABB && g2 instanceof Circle) {
    return collideCircleAABB(g2, g1)
  } else if (g1 instanceof Circle && g2 instanceof AABB) {
    return collideCircleAABB(g1, g2)
  } else if (g1 instanceof Circle && g2 instanceof Circle) {
    return collideCircleCircle(g1, g2)
  } else if (g1 instanceof Air && g2 instanceof AABB) {
    return collideAirAABB(g1, g2)
  } else if (g1 instanceof AABB && g2 instanceof Air) {
    return collideAirAABB(g2, g1)
  } else if (g1 instanceof Ray && g2 instanceof AABB) {
    return collideRayAABB(g1, g2)
  } else if (g1 instanceof AABB && g2 instanceof Ray) {
    return collideRayAABB(g2, g1)
  } else {
    assert(false, 'This collision is not implemented.')
  }
}
