import { CollisionResultSegmentAABB } from '@core/collision/collision/Segment_AABB'
import { Segment } from '@core/collision/geometry/segment'
import { Entity } from '@core/ecs/entity'
import { INFINITY_COORDINATE } from '@core/math/constants'
import { Vec2 } from '@core/math/vec2'
import { CollisionCallbackArgs } from '@game/components/colliderComponent'

export type SegmentHitResult = {
  point: Vec2
  entity?: Entity
}

export const segmentSearchGenerator = function* (
  segmentEntity: Entity,
  options?: {
    ignoreEntity?: Entity
    maximumDistance?: number
  }
): Generator<SegmentHitResult, void> {
  const [collider] = segmentEntity.getComponent('Collider').colliders
  const segment = collider.geometry as Segment

  let hitInfo: Array<SegmentHitResult> = []
  collider.callbacks.add((args: CollisionCallbackArgs) => {
    const { other } = args
    const { hitPoint } = args as CollisionResultSegmentAABB
    if (options?.ignoreEntity && other.entity === options.ignoreEntity) return
    hitInfo.push({ point: hitPoint, entity: other.entity })
  })

  while (true) {
    const closestHit = hitInfo.reduce(
      (a, b) => (a.point.sub(segment.start).length() < b.point.sub(segment.start).length() ? a : b),
      {
        point: segment.start.add(
          segment.direction.normalize().mul(options?.maximumDistance ?? INFINITY_COORDINATE)
        ),
      }
    )
    hitInfo = []
    yield closestHit
  }
}
