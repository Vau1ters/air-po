import { System } from '@core/ecs/system'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { Entity } from '@core/ecs/entity'
import { CollisionCallbackArgs } from '@game/components/colliderComponent'
import { CollisionResultAirAABB } from '@core/collision/collision/Air_AABB'

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

  private static airHolderSensor(args: CollisionCallbackArgs): void {
    const { me: airHolderCollider, other: otherCollider } = args
    const { hitAirs } = args as CollisionResultAirAABB
    // collect air
    if (otherCollider.tag.has('air')) {
      const position = airHolderCollider.entity.getComponent('Position')
      const airHolder = airHolderCollider.entity.getComponent('AirHolder')

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
      const airComponent = nearestAir.getComponent('Air')
      const collectedQuantity = airHolder.collect(airComponent.quantity)
      airComponent.decrease(collectedQuantity)
    }
  }
}
