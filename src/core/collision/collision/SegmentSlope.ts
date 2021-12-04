import { Vec2 } from '@core/math/vec2'
import { Segment } from '../geometry/segment'
import { WithHit } from '../collision'
import { Slope } from '../geometry/Slope'
import { collideSegmentAABB } from './Segment_AABB'

export type CollisionResultSegmentSlope = {
  hitPoint: Vec2
}

export const collideSegmentSlope = (
  segment: Segment,
  slope: Slope
): WithHit<CollisionResultSegmentSlope> => {
  const { hit } = collideSegmentAABB(segment, slope.createBound())
  if (!hit) return { hit: false }

  const t = slope.center.sub(segment.start).dot(segment.end.sub(segment.start))
  if (0 <= t && t <= 1) {
    return {
      hit: true,
      hitPoint: segment.start.add(segment.end.sub(segment.start).mul(t)),
    }
  }
  return { hit: false }
}
