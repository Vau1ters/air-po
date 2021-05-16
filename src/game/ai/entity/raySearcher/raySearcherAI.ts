import { CollisionResultRayAABB } from '@core/collision/collision/Ray_AABB'
import { Ray } from '@core/collision/geometry/ray'
import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { CollisionCallbackArgs } from '@game/components/colliderComponent'

export type RayHitResult = {
  point: Vec2
  entity?: Entity
}

export const raySearchGenerator = function*(
  rayEntity: Entity,
  options?: {
    ignoreEntity?: Entity
    maximumDistance?: number
  }
): Generator<RayHitResult, void> {
  const [collider] = rayEntity.getComponent('Collider').colliders
  const ray = collider.geometry as Ray

  let hitInfo: Array<RayHitResult> = []
  collider.callbacks.add((args: CollisionCallbackArgs) => {
    const { other } = args
    const { hitPoint } = args as CollisionResultRayAABB
    if (options?.ignoreEntity && other.entity === options.ignoreEntity) return
    hitInfo.push({ point: hitPoint, entity: other.entity })
  })

  while (true) {
    const closestHit = hitInfo.reduce(
      (a, b) => (a.point.sub(ray.origin).length() < b.point.sub(ray.origin).length() ? a : b),
      // イージングで吹っ飛ばないように無限遠点の距離を短く設定している
      { point: ray.origin.add(ray.direction.normalize().mul(options?.maximumDistance ?? Infinity)) }
    )
    hitInfo = []
    yield closestHit
  }
}
