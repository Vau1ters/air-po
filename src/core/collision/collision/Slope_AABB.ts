import { Vec2 } from '@core/math/vec2'
import { AABB } from '../geometry/AABB'
import { WithHit } from '../collision'
import { Slope } from '../geometry/Slope'
import { collideAABBAABB } from './AABB_AABB'

export type CollisionResultSlopeAABB = {
  clip: number
  axis: Vec2 // AABB -> Slope
}

export const collideSlopeAABB = (slope: Slope, aabb: AABB): WithHit<CollisionResultSlopeAABB> => {
  // AABB vs Slope ではAABBは幅0であるかのように振る舞う(斜面上に立つため)
  const pseudoAABB = new AABB(aabb.center, new Vec2(0, aabb.size.y))
  const aabbResult = collideAABBAABB(slope.createBound(), pseudoAABB)
  if (!aabbResult.hit) return { hit: false }
  const axis = slope.normal.mul(-1)
  const offset = pseudoAABB.center.sub(slope.center)
  const corner = pseudoAABB.size.mul(axis).mul(0.5)
  const clip = corner.add(offset).dot(axis.mul(Math.SQRT1_2))
  if (clip < 0) return { hit: false }
  return {
    hit: true,
    clip: clip,
    axis,
  }
}
