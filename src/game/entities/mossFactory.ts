import { Entity } from '@core/ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '@game/components/positionComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { parseAnimation } from '@core/graphics/animationParser'
import mossDefinition from '@res/animation/moss.json'
import { World } from '@core/ecs/world'
import { buildColliders, ColliderComponent } from '@game/components/colliderComponent'
import { Category, CategorySet } from './category'
import { Vec2 } from '@core/math/vec2'
import { LightComponent } from '@game/components/lightComponent'

export class MossFactory extends EntityFactory {
  private readonly COLLIDER = {
    type: 'AABB' as const,
    offset: new Vec2(-4, -4),
    size: new Vec2(8, 8),
  }

  public constructor(private world: World) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()

    entity.addComponent('Position', new PositionComponent())
    entity.addComponent(
      'Draw',
      new DrawComponent({
        entity,
        child: {
          sprite: parseAnimation(mossDefinition.sprite),
        },
      })
    )
    entity.addComponent(
      'Collider',
      new ColliderComponent(
        ...buildColliders({
          entity,
          colliders: [
            {
              geometry: this.COLLIDER,
              category: Category.LIGHT,
              mask: new CategorySet(Category.SENSOR),
              tag: ['light'],
            },
            {
              geometry: this.COLLIDER,
              category: Category.SENSOR,
              mask: new CategorySet(Category.AIR),
            },
          ],
        })
      )
    )
    entity.addComponent('Light', new LightComponent(0))

    return entity
  }
}
