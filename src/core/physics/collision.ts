import { AABBCollider, Collider } from '../components/colliderComponent'
import { PositionComponent } from '../components/positionComponent'

export class Collision {
  private static readonly maxClipTolerance = 5
  public static collide(
    c1: Collider,
    c2: Collider,
    position1: PositionComponent,
    position2: PositionComponent
  ): boolean {
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
        if (clip.x < this.maxClipTolerance && clip.y < this.maxClipTolerance)
          return false
        return true
      }
    }
    return false
  }
}
