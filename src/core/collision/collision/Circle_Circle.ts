import { Circle } from '../geometry/circle'
import { WithHit } from '../collision'

export type CollisionResultCircleCircle = {
  clip: number
}

export const collideCircleCircle = (
  c1: Circle,
  c2: Circle
): WithHit<CollisionResultCircleCircle> => {
  const dist2 = c1.position.sub(c2.position).lengthSq()
  const radius = c1.radius + c2.radius
  if (dist2 > radius * radius) return { hit: false }
  return { hit: true, clip: radius - Math.sqrt(dist2) }
}
