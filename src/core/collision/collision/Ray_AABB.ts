import { Vec2 } from '@core/math/vec2'
import { AABB } from '../geometry/AABB'
import { Ray } from '../geometry/ray'
import { WithHit } from '../collision'

export type CollisionResultRayAABB = {
  hitPoint: Vec2
}

type Axis = 'x' | 'y'
// 微小量
const delta = 0.0001

export const collideRayAABB = (ray: Ray, aabb: AABB): WithHit<CollisionResultRayAABB> => {
  // Rayの原点がすでにAABB内にある
  if (aabb.contains(ray.start)) return { hit: true, hitPoint: ray.start.copy() }

  // AABBの各座標のmax/min
  const minB = aabb.min
  const maxB = aabb.max
  // Rayの原点からAABBの辺に到達する時間
  const minT = new Vec2()
  const candidatePlane = new Vec2()

  const axes: Axis[] = ['x', 'y']
  for (const axis of axes) {
    if (
      (minB[axis] <= ray.start[axis] && ray.start[axis] <= maxB[axis]) ||
      ray.direction[axis] === 0
    ) {
      minT[axis] = -1
    } else if (ray.start[axis] < minB[axis]) {
      minT[axis] = (minB[axis] - ray.start[axis]) / (ray.end[axis] - ray.start[axis])
      candidatePlane[axis] = minB[axis]
    } else if (ray.start[axis] > maxB[axis]) {
      minT[axis] = (maxB[axis] - ray.start[axis]) / (ray.end[axis] - ray.start[axis])
      candidatePlane[axis] = maxB[axis]
    }
  }

  const hitPlane: Axis = minT.x >= minT.y ? 'x' : 'y'
  const hitTime = minT[hitPlane]
  // Rayと逆方向なので当たらない
  if (hitTime < 0) return { hit: false }
  // 遠すぎて当たらない
  if (hitTime > 1) return { hit: false }

  // 実際にRayを飛ばす
  const hitPoint = new Vec2()
  hitPoint.x = ray.start.x + (ray.end.x - ray.start.x) * hitTime
  hitPoint.y = ray.start.y + (ray.end.y - ray.start.y) * hitTime
  // 飛ばしたRayが当たらなかったら
  if (
    (hitPlane === 'y' && !(minB.x - delta <= hitPoint.x && hitPoint.x <= maxB.x + delta)) ||
    (hitPlane === 'x' && !(minB.y - delta <= hitPoint.y && hitPoint.y <= maxB.y + delta))
  ) {
    return { hit: false }
  }

  return { hit: true, hitPoint }
}
