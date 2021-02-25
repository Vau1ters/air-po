import { Vec2 } from '@core/math/vec2'
import { OBB } from '../geometry/obb'
import { WithHit } from '../collision'

export type CollisionResultOBBOBB = {
  clip: number
  axis: Vec2 // 1 -> 2
}

export const collideOBBOBB = (obb1: OBB, obb2: OBB): WithHit<CollisionResultOBBOBB> => {
  // project shadow of obb on axis and returns its ends
  const project = (obb: OBB, axis: Vec2): { min: number; max: number } => {
    const dc = obb.bound.center.dot(axis)
    const dx = (obb.axisX.abs().dot(axis.abs()) * obb.bound.size.x) / 2
    const dy = (obb.axisY.abs().dot(axis.abs()) * obb.bound.size.y) / 2

    return { min: dc - dx - dy, max: dc + dx + dy }
  }
  const intersect = (axis: Vec2): WithHit<CollisionResultOBBOBB> => {
    const { min: min1, max: max1 } = project(obb1, axis)
    const { min: min2, max: max2 } = project(obb2, axis)
    if (max2 < min1) return { hit: false }
    if (max1 < min2) return { hit: false }
    // project(obb2, axis).max + clip = project(obb1, axis).min
    // or
    // project(obb2, axis).min + clip = project(obb1, axis).max
    const clip1 = min1 - max2
    const clip2 = max1 - min2
    const clip = Math.abs(clip1) < Math.abs(clip2) ? clip1 : clip2
    return { hit: true, clip: Math.abs(clip), axis: axis.mul(Math.sign(clip)) }
  }
  const axis = [obb1.axisX, obb1.axisY, obb2.axisX, obb2.axisY]
  const rs = axis.map(a => intersect(a)).filter(r => r.hit) as Array<CollisionResultOBBOBB>
  if (rs.length < 4) {
    return { hit: false }
  }
  return { hit: true, ...rs.reduce((a, b) => (a.clip < b.clip ? a : b)) }
}
