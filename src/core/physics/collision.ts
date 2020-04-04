import {
  AABBCollider,
  Collider,
  CircleCollider,
} from '../components/colliderComponent'
import { PositionComponent } from '../components/positionComponent'

export const collide = (
  c1: Collider,
  c2: Collider,
  position1: PositionComponent,
  position2: PositionComponent
): boolean => {
  if (c1 instanceof AABBCollider && c2 instanceof AABBCollider) {
    const aabb1 = c1.aabb.add(position1)
    const aabb2 = c2.aabb.add(position2)
    if (aabb1.overlap(aabb2)) {
      const center1 = aabb1.center
      const center2 = aabb2.center

      // めり込み量
      const clip = aabb1.size
        .add(aabb2.size)
        .div(2)
        .sub(center1.sub(center2).abs())

      // 四隅の浅い衝突も衝突していないことにする
      const tolerance = c1.maxClipTolerance.add(c2.maxClipTolerance)
      if (clip.x < tolerance.x && clip.y < tolerance.y) return false
      return true
    }
  } else if (c1 instanceof CircleCollider && c2 instanceof CircleCollider) {
    const aabb1 = c1.circle.add(position1)
    const aabb2 = c2.circle.add(position2)
    return aabb1.overlap(aabb2)
  }
  return false
}
