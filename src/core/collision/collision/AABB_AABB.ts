import { Vec2 } from '@core/math/vec2'
import { AABB } from '../geometry/aabb'
import { WithHit } from '../collision'

export type CollisionResultAABBAABB = {
  clip: number
  axis: Vec2 // 1 -> 2
}

export const collideAABBAABB = (aabb1: AABB, aabb2: AABB): WithHit<CollisionResultAABBAABB> => {
  if (!aabb1.overlap(aabb2)) return { hit: false }

  const dx1 = aabb1.max.x - aabb2.min.x
  const dx2 = aabb1.min.x - aabb2.max.x
  const dy1 = aabb1.max.y - aabb2.min.y
  const dy2 = aabb1.min.y - aabb2.max.y

  const clip = new Vec2(
    Math.abs(dx1) < Math.abs(dx2) ? dx1 : dx2,
    Math.abs(dy1) < Math.abs(dy2) ? dy1 : dy2
  )

  // 四隅の浅い衝突も衝突していないことにする
  const tolerance = aabb1.maxClipToTolerance.add(aabb2.maxClipToTolerance)
  const cx = Math.abs(clip.x) - tolerance.x
  const cy = Math.abs(clip.y) - tolerance.y
  if (cx < 0 && cy < 0) return { hit: false }
  if (Math.abs(clip.x) < Math.abs(clip.y)) {
    return { hit: true, clip: Math.abs(clip.x), axis: new Vec2(Math.sign(clip.x), 0) }
  } else {
    return { hit: true, clip: Math.abs(clip.y), axis: new Vec2(0, Math.sign(clip.y)) }
  }
}
