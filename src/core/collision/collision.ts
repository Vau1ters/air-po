import { Vec2 } from '@core/math/vec2'
import { Collider } from '@game/components/colliderComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { assert } from '@utils/assertion'
import { CollisionResultAABBAABB, collideAABBAABB } from './collision/AABB_AABB'
import { CollisionResultAirAABB, collideAirAABB } from './collision/Air_AABB'
import { collideSegmentSlope } from './collision/SegmentSlope'
import { CollisionResultSegmentAABB, collideSegmentAABB } from './collision/Segment_AABB'
import { collideSlopeAABB, CollisionResultSlopeAABB } from './collision/Slope_AABB'
import { AABB } from './geometry/AABB'
import { Air } from './geometry/air'
import { Segment } from './geometry/segment'
import { Slope } from './geometry/Slope'

export type WithHit<T> = { hit: false } | ({ hit: true } & T)

export type CollisionResult =
  | CollisionResultAABBAABB
  | CollisionResultAirAABB
  | CollisionResultSegmentAABB
  | CollisionResultSlopeAABB

export const flipResult = <R>(result: R): R => {
  if ('axis' in result) {
    const axis = ((result as unknown) as { axis?: Vec2 })['axis'] as Vec2
    return {
      ...result,
      axis: axis.mul(-1),
    }
  }
  return result
}

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
  } else if (g1 instanceof Air && g2 instanceof AABB) {
    return collideAirAABB(g1, g2)
  } else if (g1 instanceof AABB && g2 instanceof Air) {
    return collideAirAABB(g2, g1)
  } else if (g1 instanceof Segment && g2 instanceof AABB) {
    return collideSegmentAABB(g1, g2)
  } else if (g1 instanceof AABB && g2 instanceof Segment) {
    return collideSegmentAABB(g2, g1)
  } else if (g1 instanceof AABB && g2 instanceof Slope) {
    return collideSlopeAABB(g2, g1)
  } else if (g1 instanceof Slope && g2 instanceof AABB) {
    return flipResult(collideSlopeAABB(g1, g2))
  } else if (g1 instanceof Segment && g2 instanceof Slope) {
    return collideSegmentSlope(g1, g2)
  } else if (g1 instanceof Slope && g2 instanceof Segment) {
    return collideSegmentSlope(g2, g1)
  } else {
    assert(false, 'This collision is not implemented.')
  }
}
