import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { Collider } from '@game/components/colliderComponent'
import { StaticComponent } from '@game/components/staticComponent'
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

    const [collider] = entity.getComponent('Collider').colliders
    collider.condition = (_: Collider, other: Collider): boolean => {
      if (!other.entity.hasComponent('RigidBody')) return false
      return other.entity.getComponent('RigidBody').velocity.y > -1e-3
    }

    return entity
  }
}
