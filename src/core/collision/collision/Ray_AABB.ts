import { Vec2 } from '@core/math/vec2'
import { AABB } from '../geometry/aabb'
import { Ray } from '../geometry/ray'
import { WithHit } from '../collision'

export type CollisionResultRayAABB = {
  hitPoint: Vec2
}

export const collideRayAABB = (ray: Ray, aabb: AABB): WithHit<CollisionResultRayAABB> => {
  type Axis = 'x' | 'y'
  // 微小量
  const delta = 0.0001

  // Rayの原点がすでにAABB内にある
  if (aabb.contains(ray.origin)) return { hit: true, hitPoint: ray.origin.copy() }

  // AABBの各座標のmax/min
  const minB = aabb.min
  const maxB = aabb.max
  // Rayの原点からAABBの辺に到達する時間
  const minT = new Vec2()
  const candidatePlane = new Vec2()

  const axes: Axis[] = ['x', 'y']
  for (const axis of axes) {
    if (
      (minB[axis] <= ray.origin[axis] && ray.origin[axis] <= maxB[axis]) ||
      ray.direction[axis] === 0
    ) {
      minT[axis] = -1
    } else if (ray.origin[axis] < minB[axis]) {
      minT[axis] = (minB[axis] - ray.origin[axis]) / ray.direction[axis]
      candidatePlane[axis] = minB[axis]
    } else if (ray.origin[axis] > maxB[axis]) {
      minT[axis] = (maxB[axis] - ray.origin[axis]) / ray.direction[axis]
      candidatePlane[axis] = maxB[axis]
    }
  }

  const hitPlane: Axis = minT.x >= minT.y ? 'x' : 'y'
  const hitTime = minT[hitPlane]
  // Rayと逆方向なので当たらない
  if (hitTime < 0) return { hit: false }

  // 実際にRayを飛ばす
  const hitPoint = new Vec2()
  hitPoint.x = ray.origin.x + ray.direction.x * hitTime
  hitPoint.y = ray.origin.y + ray.direction.y * hitTime
  // 飛ばしたRayが当たらなかったら
  if (
    (hitPlane === 'y' && !(minB.x - delta <= hitPoint.x && hitPoint.x <= maxB.x + delta)) ||
    (hitPlane === 'x' && !(minB.y - delta <= hitPoint.y && hitPoint.y <= maxB.y + delta))
  ) {
    return { hit: false }
  }

  return { hit: true, hitPoint }
}
