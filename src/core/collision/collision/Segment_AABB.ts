import { Vec2 } from '@core/math/vec2'
import { AABB } from '../geometry/AABB'
import { Segment } from '../geometry/segment'
import { WithHit } from '../collision'

export type CollisionResultSegmentAABB = {
  hitPoint: Vec2
}

type Axis = 'x' | 'y'
// 微小量
const delta = 0.0001

export const collideSegmentAABB = (
  segment: Segment,
  aabb: AABB
): WithHit<CollisionResultSegmentAABB> => {
  // Segmentの原点がすでにAABB内にある
  if (aabb.contains(segment.start)) return { hit: true, hitPoint: segment.start.copy() }

  // AABBの各座標のmax/min
  const minB = aabb.min
  const maxB = aabb.max
  // Segmentの原点からAABBの辺に到達する時間
  const minT = new Vec2()
  const candidatePlane = new Vec2()

  const axes: Axis[] = ['x', 'y']
  for (const axis of axes) {
    if (
      (minB[axis] <= segment.start[axis] && segment.start[axis] <= maxB[axis]) ||
      segment.direction[axis] === 0
    ) {
      minT[axis] = -1
    } else if (segment.start[axis] < minB[axis]) {
      minT[axis] = (minB[axis] - segment.start[axis]) / (segment.end[axis] - segment.start[axis])
      candidatePlane[axis] = minB[axis]
    } else if (segment.start[axis] > maxB[axis]) {
      minT[axis] = (maxB[axis] - segment.start[axis]) / (segment.end[axis] - segment.start[axis])
      candidatePlane[axis] = maxB[axis]
    }
  }

  const hitPlane: Axis = minT.x >= minT.y ? 'x' : 'y'
  const hitTime = minT[hitPlane]
  // Segmentと逆方向なので当たらない
  if (hitTime < 0) return { hit: false }
  // 遠すぎて当たらない
  if (hitTime > 1) return { hit: false }

  // 実際にSegmentを飛ばす
  const hitPoint = new Vec2()
  hitPoint.x = segment.start.x + (segment.end.x - segment.start.x) * hitTime
  hitPoint.y = segment.start.y + (segment.end.y - segment.start.y) * hitTime
  // 飛ばしたSegmentが当たらなかったら
  if (
    (hitPlane === 'y' && !(minB.x - delta <= hitPoint.x && hitPoint.x <= maxB.x + delta)) ||
    (hitPlane === 'x' && !(minB.y - delta <= hitPoint.y && hitPoint.y <= maxB.y + delta))
  ) {
    return { hit: false }
  }

  return { hit: true, hitPoint }
}
