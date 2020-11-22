import { System } from '@core/ecs/system'
import { Entity } from '@core/ecs/entity'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { Collider } from '@game/components/colliderComponent'

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

  private static footCollisionCallback(playerCollider: Collider, otherCollider: Collider): void {
    const player = playerCollider.entity.getComponent('Player')
    if (!otherCollider.isSensor) {
      if (playerCollider.entity.getComponent('RigidBody').velocity.y > -1e-2) {
        player.landing = true
      }
    }
  }

  private static itemPickerCallback(playerCollider: Collider, otherCollider: Collider): void {
    const player = playerCollider.entity.getComponent('Player')
    const other = otherCollider.entity
    if (other.hasComponent('PickupTarget')) {
      player.pickupTarget.add(other) // this target reference will be removed in playerPickup
    }
  }
}
