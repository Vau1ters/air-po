import { Entity } from '@core/ecs/entity'
import { buildCollider, ColliderComponent } from '@game/components/colliderComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { Category, CategorySet } from './category'
import { EntityFactory } from './entityFactory'

export class RaySearcherFactory extends EntityFactory {
  private mask: CategorySet = new CategorySet()

  public addCategoryToMask(...categories: Category[]): this {
    for (const category of categories) {
      this.mask.add(category)
    }
    return this
  }

  public create(): Entity {
    const entity = new Entity()

    entity.addComponent(
      'Collider',
      new ColliderComponent(
        buildCollider({
          entity,
          geometry: { type: 'Ray' },
          category: Category.SENSOR,
          mask: this.mask,
        })
      )
    )
    entity.addComponent('Position', new PositionComponent())

    return entity
  }
}
