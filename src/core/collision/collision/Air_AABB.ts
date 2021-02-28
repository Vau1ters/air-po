import { AABB } from '../geometry/AABB'
import { Air } from '../geometry/air'
import { WithHit } from '../collision'
import { Entity } from '@core/ecs/entity'

export type CollisionResultAirAABB = {
  hitAirs: Entity[]
}

export const collideAirAABB = (airs: Air, aabb: AABB): WithHit<CollisionResultAirAABB> => {
  let score = 0
  const hitAirs: Entity[] = []
  for (const air of airs.family.entityIterator) {
    const airComponent = air.getComponent('Air')
    const pos = air.getComponent('Position')
    const r2 = airComponent.quantity * airComponent.quantity
    const d2 = pos.sub(aabb.center).lengthSq()
    const R2 = Air.EFFECTIVE_RADIUS * Air.EFFECTIVE_RADIUS
    const hit = d2 < R2
    if (!hit) continue
    hitAirs.push(air)
    score += Math.max(0, r2 * (1 / d2 - 1 / R2))
  }
  if (score <= 1) return { hit: false }
  return { hit: true, hitAirs }
}
