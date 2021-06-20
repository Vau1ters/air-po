import { Ray } from '@core/collision/geometry/ray'
import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { buildCollider, Collider, ColliderComponent } from '@game/components/colliderComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { Category, CategorySet } from './category'
import { EntityFactory } from './entityFactory'

export class RaySearcherFactory extends EntityFactory {
  private mask: CategorySet = new CategorySet()
  private raySetting: {
    start?: Vec2
    end?: Vec2
  } = {}

  public addCategoryToMask(...categories: Category[]): this {
    for (const category of categories) {
      this.mask.add(category)
    }
    return this
  }

  public setRayStart(start: Vec2): this {
    this.raySetting.start = start
    return this
  }

  public setRayEnd(end: Vec2): this {
    this.raySetting.end = end
    return this
  }

  public create(): Entity {
    const entity = new Entity()

    const collider: Collider = buildCollider({
      entity,
      geometry: { type: 'Ray' },
      category: Category.SENSOR,
      mask: this.mask,
    })
    const ray = collider.geometry as Ray
    if (this.raySetting.start) ray.start = this.raySetting.start
    if (this.raySetting.end) ray.end = this.raySetting.end

    entity.addComponent('Collider', new ColliderComponent(collider))
    entity.addComponent('Position', new PositionComponent())

    return entity
  }
}
