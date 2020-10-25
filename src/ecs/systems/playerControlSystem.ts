import { System } from '../system'
import { Entity } from '../entity'
import { Family, FamilyBuilder } from '../family'
import { World } from '../world'
import { Collider } from '../components/colliderComponent'

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
        if (c.tag.has('playerItemPicker')) {
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
      player.landing = true
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
