import { AABB } from './aabb'
import { Vec2 } from '@core/math/vec2'

type Axis = 'x' | 'y'
// 微小量
const delta = 0.0001

export const raycastToAABB = (ray: Ray, aabb: AABB): Vec2 | undefined => {
  // Rayの原点がすでにAABB内にある
  if (aabb.contains(ray.origin)) return ray.origin.copy()

  // AABBの各座標のmax/min
  const minB = new Vec2(aabb.left, aabb.top)
  const maxB = new Vec2(aabb.right, aabb.bottom)
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
  const reachTime = minT[hitPlane]
  // Rayと逆方向なので当たらない
  if (reachTime < 0) return undefined

  // 実際にRayを飛ばす
  const reachPoint = new Vec2()
  reachPoint.x = ray.origin.x + ray.direction.x * reachTime
  reachPoint.y = ray.origin.y + ray.direction.y * reachTime
  // 飛ばしたRayが当たらなかったら
  if (
    (hitPlane === 'y' && !(minB.x - delta <= reachPoint.x && reachPoint.x <= maxB.x + delta)) ||
    (hitPlane === 'x' && !(minB.y - delta <= reachPoint.y && reachPoint.y <= maxB.y + delta))
  ) {
    return undefined
  }

  return reachPoint
}

export class Ray {
  public constructor(public origin = new Vec2(), public direction = new Vec2()) {}
}
