import { System } from '@core/ecs/system'
import { Entity } from '@core/ecs/entity'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { CollisionCallbackArgs } from '@game/components/colliderComponent'

export class PlayerControlSystem extends System {
  private family: Family

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('Player', 'RigidBody').build()
    this.family.entityAddedEvent.addObserver(this.entityAdded)
  }

  private entityAdded(entity: Entity): void {
    const collider = entity.getComponent('Collider')
    if (collider) {
      for (const c of collider.colliders) {
        if (c.tag.has('playerFoot')) {
          c.callbacks.add(PlayerControlSystem.footCollisionCallback)
        }
        if (c.tag.has('playerSensor')) {
          c.callbacks.add(PlayerControlSystem.itemPickerCallback)
        }
      }
    }
  }

  public update(): void {
    // 何もしない
  }

  private static footCollisionCallback(args: CollisionCallbackArgs): void {
    const {
      me: { entity: playerEntity },
      other,
    } = args
    if (other.isSensor) return

    const rigidBody = playerEntity.getComponent('RigidBody')
    if (rigidBody.velocity.y < -1e-2) return

    const player = playerEntity.getComponent('Player')
    player.landing = true
  }

  private static itemPickerCallback(args: CollisionCallbackArgs): void {
    const {
      me: { entity: playerEntity },
      other: { entity: other },
    } = args
    const player = playerEntity.getComponent('Player')
    if (other.hasComponent('PickupTarget')) {
      player.pickupTarget.add(other) // this target reference will be removed in playerPickup
    }
  }
}
