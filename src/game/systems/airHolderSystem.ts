import { System } from '@core/ecs/system'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { Entity } from '@core/ecs/entity'
import { CollisionCallbackArgs } from '@game/components/colliderComponent'
import { CollisionResultAirAABB } from '@core/collision/collision/Air_AABB'
import { assert } from '@utils/assertion'
import { AIR_TAG } from './airSystem'
import { AirFactory } from '@game/entities/airFactory'

export const AIR_HOLDER_TAG = 'airHolderBody'
export const SUFFOCATION_DAMAGE_INTERVAL = 120

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
      const position = entity.getComponent('Position')
      const airHolder = entity.getComponent('AirHolder')

      const nearestAir =
        airHolder.hitAirs.length > 0
          ? airHolder.hitAirs
              .reduce((a, b) => {
                const aa = a.getComponent('Air')
                const pa = a.getComponent('Position')
                const ab = b.getComponent('Air')
                const pb = b.getComponent('Position')
                if (
                  pa.sub(position).lengthSq() / aa.quantity <
                  pb.sub(position).lengthSq() / ab.quantity
                ) {
                  return a
                } else {
                  return b
                }
              })
              .getComponent('Air')
          : undefined

      // air consume
      airHolder.consume()
      if (airHolder.shouldDamageInSuffocation && airHolder.quantity === 0) {
        if (++airHolder.suffocationDamageCount % SUFFOCATION_DAMAGE_INTERVAL === 0) {
          entity.getComponent('Hp').decrease(1)
          entity.getComponent('Invincible').setInvincible()
        }
      } else {
        airHolder.suffocationDamageCount = 0
      }

      // air collect
      if (nearestAir) {
        const collectedQuantity = airHolder.collect(nearestAir.quantity)
        nearestAir.decrease(collectedQuantity)
      }

      // air emit
      if (airHolder.emitSpeed > 0) {
        const consumedQuantity = airHolder.consumeBy(airHolder.emitSpeed)
        if (nearestAir) {
          nearestAir.increase(consumedQuantity)
        } else {
          this.world.addEntity(new AirFactory(position, consumedQuantity).create())
        }
      }

      // reset
      airHolder.hitAirs = []
    }
  }

  private entityAdded(entity: Entity): void {
    if (entity.hasComponent('Collider')) {
      const collider = entity.getComponent('Collider')
      for (const c of collider.colliders) {
        if (c.hasTag(AIR_HOLDER_TAG)) {
          assert(
            c.category === 'airHolder',
            `Collider with '${AIR_HOLDER_TAG}' tag must have AIR_HOLDER category`
          )
          assert(c.mask.has('air'), `Collider with '${AIR_HOLDER_TAG}' tag must have AIR mask`)
          c.notifier.addObserver(AirHolderSystem.airHolderSensor)
        }
      }
    }
  }

  private entityRemoved(entity: Entity): void {
    if (entity.hasComponent('Collider')) {
      const collider = entity.getComponent('Collider')
      for (const c of collider.colliders) {
        if (c.hasTag(AIR_HOLDER_TAG)) {
          c.notifier.removeObserver(AirHolderSystem.airHolderSensor)
        }
      }
    }
  }

  private static airHolderSensor(args: CollisionCallbackArgs): void {
    const { me: airHolderCollider, other: otherCollider } = args
    const { hitAirs } = args as CollisionResultAirAABB
    // collect air
    if (otherCollider.hasTag(AIR_TAG)) {
      const airHolder = airHolderCollider.entity.getComponent('AirHolder')
      airHolder.hitAirs.push(...hitAirs)
    }
  }
}
