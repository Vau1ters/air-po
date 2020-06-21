import { System } from '../ecs/system'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'
import { Entity } from '../ecs/entity'
import { Collider, AirCollider } from '../components/colliderComponent'
import { assert } from '../../utils/assertion'

export class AirHolderSystem extends System {
  private family: Family

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('AirHolder').build()
    this.family.entityAddedEvent.addObserver(this.entityAdded)
    this.family.entityAddedEvent.removeObserver(this.entityRemoved)
  }

  public update(): void {
    for (const entity of this.family.entityIterator) {
      // air consume
      const airHolder = entity.getComponent('AirHolder')
      airHolder.consume()
    }
  }

  private entityAdded(entity: Entity): void {
    if (entity.hasComponent('Collider')) {
      const collider = entity.getComponent('Collider')
      for (const c of collider.colliders) {
        if (c.tag.has('airHolderBody')) {
          c.callbacks.add(AirHolderSystem.airHolderSensor)
        }
      }
    }
  }

  private entityRemoved(entity: Entity): void {
    if (entity.hasComponent('Collider')) {
      const collider = entity.getComponent('Collider')
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

      const position = airHolderCollider.component.entity.getComponent('Position')
      const airHolder = airHolderCollider.component.entity.getComponent('AirHolder')

      const hitAirs: Entity[] = otherCollider.airFamily.entityArray.filter(
        (a: Entity) => a.getComponent('Air').hit
      )
      const nearestAir = hitAirs.reduce((a, b) => {
        const aa = a.getComponent('Air')
        const pa = a.getComponent('Position')
        const ab = b.getComponent('Air')
        const pb = b.getComponent('Position')
        if (pa.sub(position).lengthSq() / aa.quantity < pb.sub(position).lengthSq() / ab.quantity) {
          return a
        } else {
          return b
        }
      })
      const air = nearestAir.getComponent('Air')
      const collectedQuantity = airHolder.collect(air.quantity)
      air.decrease(collectedQuantity)
    }
  }
}
