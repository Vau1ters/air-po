import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { ColliderComponent, buildColliders } from '@game/components/colliderComponent'
import { LightComponent } from '@game/components/lightComponent'
import { LIGHT_TAG } from '@game/systems/lightSystem'
import { Category, CategorySet } from '../category'
import { MapObjectFactory } from './mapObjectFactory'

export class MossFactory extends MapObjectFactory {
  private readonly COLLIDER = {
    type: 'AABB' as const,
    size: new Vec2(8, 8),
  }

  public create(): Entity {
    const entity = super.create()

    entity.addComponent(
      'Collider',
      new ColliderComponent(
        ...buildColliders({
          entity,
          colliders: [
            {
              geometry: this.COLLIDER,
              category: Category.LIGHT,
              mask: new CategorySet(Category.AIR),
              tag: [LIGHT_TAG],
            },
          ],
        })
      )
    )
    entity.addComponent('Light', new LightComponent(0))

    return entity
  }
}
