import { AABB } from '../geometry/aabb'
import { Circle } from '../geometry/circle'
import { WithHit } from '../collision'

export type CollisionResultCircleAABB = {
  clip: number
}

export const collideCircleAABB = (
  circle: Circle,
  aabb: AABB
): WithHit<CollisionResultCircleAABB> => {
  const distX = Math.max(0, aabb.left - circle.center.x, circle.center.x - aabb.right)
  const distY = Math.max(0, aabb.top - circle.center.y, circle.center.y - aabb.bottom)

  const dist2 = distX * distX + distY * distY
  const radius2 = circle.radius * circle.radius

  if (dist2 > radius2) return { hit: false }
  return { hit: true, clip: Math.sqrt(radius2) - Math.sqrt(dist2) }
}
