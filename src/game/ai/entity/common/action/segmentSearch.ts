import { Behaviour } from '@core/behaviour/behaviour'
import { wait } from '@core/behaviour/wait'
import { CollisionResultSegmentAABB } from '@core/collision/collision/Segment_AABB'
import { Segment } from '@core/collision/geometry/segment'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { buildCollider, ColliderComponent } from '@game/components/colliderComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { CategorySet } from '@game/entities/category'

export type SegmentSearchOption = {
  start: Vec2
  end: Vec2
  mask: CategorySet
  world: World
}

export type SegmentSearchResult = {
  point: Vec2
  entity?: Entity
}

export const searchBySegment = function* (
  option: SegmentSearchOption
): Behaviour<SegmentSearchResult> {
  const entity = new Entity()

  const collider = buildCollider({
    entity,
    geometry: {
      type: 'Segment',
      start: option.start,
      end: option.end,
    },
    category: 'sensor',
    mask: option.mask,
  })
  entity.addComponent('Collider', new ColliderComponent(collider))
  entity.addComponent('Position', new PositionComponent())

  option.world.addEntity(entity)

  const collisionResults = yield* wait.collision(collider, { allowNoCollision: true })
  const searchResults = collisionResults.map(args => {
    const { other } = args
    const { hitPoint } = args as CollisionResultSegmentAABB
    return { point: hitPoint, entity: other.entity }
  })

  option.world.removeEntity(entity)

  const segment = collider.geometry as Segment

  return searchResults.reduce(
    (a, b) => (a.point.sub(segment.start).length() < b.point.sub(segment.start).length() ? a : b),
    {
      point: segment.end,
    }
  )
}
