import { Entity } from '@core/ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '@game/components/positionComponent'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { ColliderComponent, Collider, buildCollider } from '@game/components/colliderComponent'
import { Vec2 } from '@core/math/vec2'
import { Category, CategorySet } from './category'
import throughFloorDefinition from '@res/animation/throughFloor.json'
import { parseAnimation } from '@core/graphics/animationParser'
import { StaticComponent } from '@game/components/staticComponent'

export class ThroughFloorFactory extends EntityFactory {
  private readonly COLLIDER = {
    type: 'AABB' as const,
    offset: new Vec2(0, -2),
    size: new Vec2(8, 4),
  }

  public create(): Entity {
    const entity = new Entity()

    entity.addComponent('Static', new StaticComponent())
    entity.addComponent('Position', new PositionComponent())
    entity.addComponent(
      'Draw',
      new DrawComponent({
        entity,
        child: {
          sprite: parseAnimation(throughFloorDefinition.sprite),
        },
      })
    )
    entity.addComponent(
      'Collider',
      new ColliderComponent(
        buildCollider({
          entity,
          geometry: this.COLLIDER,
          category: Category.STATIC_WALL,
          mask: new CategorySet(Category.SENSOR, Category.PHYSICS),
          tag: ['throughFloor'],
          condition: (_: Collider, other: Collider): boolean => {
            if (!other.entity.hasComponent('RigidBody')) return false
            return other.entity.getComponent('RigidBody').velocity.y > -1e-3
          },
        })
      )
    )

    entity.addComponent('RigidBody', new RigidBodyComponent())

    return entity
  }
}
