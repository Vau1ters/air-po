import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { ColliderComponent, buildCollider, Collider } from '@game/components/colliderComponent'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'
import { StaticComponent } from '@game/components/staticComponent'
import { PHYSICS_TAG } from '@game/systems/physicsSystem'
import { Category, CategorySet } from '../category'
import { TileEntityFactory } from './tileEntityFactory'

export const THROUGH_FLOOR_TAG = 'ThroughFloor'

export class ThroughFloorFactory extends TileEntityFactory {
  private readonly COLLIDER = {
    type: 'AABB' as const,
    offset: new Vec2(0, -2),
    size: new Vec2(8, 0),
  }

  public create(): Entity {
    const entity = super.create()

    entity.addComponent('Static', new StaticComponent())
    entity.addComponent(
      'Collider',
      new ColliderComponent(
        buildCollider({
          entity,
          geometry: this.COLLIDER,
          category: Category.TERRAIN,
          mask: new CategorySet(Category.PHYSICS),
          tag: [PHYSICS_TAG, THROUGH_FLOOR_TAG],
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
