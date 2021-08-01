import { Entity } from '@core/ecs/entity'
import { Collider } from '@game/components/colliderComponent'
import { StaticComponent } from '@game/components/staticComponent'
import { TileEntityFactory } from '@game/entities/tileEntityFactory'

export const THROUGH_FLOOR_TAG = 'ThroughFloor'

export default class ThroughFloorFactory extends TileEntityFactory {
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
