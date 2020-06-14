import { System } from '../ecs/system'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'
import { Entity } from '../ecs/entity'
import { Collider, AirCollider } from '../components/colliderComponent'
import { assert } from '../../utils/assertion'
import { PositionComponent } from '../components/positionComponent'
import { AirHolderComponent } from '../components/airHolderComponent'
import { AirComponent } from '../components/airComponent'

export class AirHolderSystem extends System {
  private family: Family

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('AirHolder').build()
    this.family.entityAddedEvent.addObserver(this.entityAdded)
    this.family.entityAddedEvent.removeObserver(this.entityRemoved)
  }

  public update(): void {
    // no implementation
  }

  private entityAdded(entity: Entity): void {
    const collider = entity.getComponent('Collider')
    if (collider) {
      for (const c of collider.colliders) {
        if (c.tag.has('airHolderBody')) {
          c.callbacks.add(AirHolderSystem.airHolderSensor)
        }
      }
    }
  }

  private entityRemoved(entity: Entity): void {
    const collider = entity.getComponent('Collider')
    if (collider) {
      for (const c of collider.colliders) {
        if (c.tag.has('airHolderBody')) {
          c.callbacks.delete(AirHolderSystem.airHolderSensor)
        }
      }
    }
  }

  private static airHolderSensor(airHolderCollider: Collider, otherCollider: Collider): void {
    // collect air
    if (otherCollider.tag.has('air')) {
      assert(otherCollider instanceof AirCollider)

      const position = airHolderCollider.component.entity.getComponent(
        'Position'
      ) as PositionComponent
      const airHolder = airHolderCollider.component.entity.getComponent(
        'AirHolder'
      ) as AirHolderComponent

      const hitAirs: Entity[] = otherCollider.airFamily.entityArray.filter(
        (a: Entity) => (a.getComponent('Air') as AirComponent).hit
      )
      const nearestAir = hitAirs.reduce((a, b) => {
        const aa = a.getComponent('Air') as AirComponent
        const pa = a.getComponent('Position') as PositionComponent
        const ab = b.getComponent('Air') as AirComponent
        const pb = b.getComponent('Position') as PositionComponent
        if (pa.sub(position).lengthSq() / aa.quantity < pb.sub(position).lengthSq() / ab.quantity) {
          return a
        } else {
          return b
        }
      })
      const air = nearestAir.getComponent('Air') as AirComponent
      const collectedQuantity = airHolder.collect(air.quantity)
      air.decrease(collectedQuantity)
    }
  }
}
