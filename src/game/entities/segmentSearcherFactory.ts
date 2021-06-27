import { Segment } from '@core/collision/geometry/segment'
import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { buildCollider, Collider, ColliderComponent } from '@game/components/colliderComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { Category, CategorySet } from './category'
import { EntityFactory } from './entityFactory'

export class SegmentSearcherFactory extends EntityFactory {
  private mask: CategorySet = new CategorySet()
  private segmentSetting: {
    start?: Vec2
    end?: Vec2
  } = {}

  public addCategoryToMask(...categories: Category[]): this {
    for (const category of categories) {
      this.mask.add(category)
    }
    return this
  }

  public setSegmentStart(start: Vec2): this {
    this.segmentSetting.start = start
    return this
  }

  public setSegmentEnd(end: Vec2): this {
    this.segmentSetting.end = end
    return this
  }

  public create(): Entity {
    const entity = new Entity()

    const collider: Collider = buildCollider({
      entity,
      geometry: { type: 'Segment' },
      category: Category.SENSOR,
      mask: this.mask,
    })
    const segment = collider.geometry as Segment
    if (this.segmentSetting.start) segment.start = this.segmentSetting.start
    if (this.segmentSetting.end) segment.end = this.segmentSetting.end

    entity.addComponent('Collider', new ColliderComponent(collider))
    entity.addComponent('Position', new PositionComponent())

    return entity
  }
}
