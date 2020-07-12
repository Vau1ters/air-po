import { System } from '../ecs/system'
import { Entity } from '../ecs/entity'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'
import { Collider } from '../components/colliderComponent'
import { KeyController } from '../controller'

export class PlayerControlSystem extends System {
  private family: Family
  private airFamily: Family

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('Player').build()
    this.airFamily = new FamilyBuilder(world).include('Air').build()
    this.family.entityAddedEvent.addObserver(this.entityAdded)
  }

  private entityAdded(entity: Entity): void {
    const collider = entity.getComponent('Collider')
    if (collider) {
      for (const c of collider.colliders) {
        if (c.tag.has('playerFoot')) {
          c.callbacks.add(PlayerControlSystem.footCollisionCallback)
        }
      }
    }
  }

  public update(): void {
    if (KeyController.isKeyPressing('X')) {
      console.log('po')
      for (const player of this.family.entityIterator) {
        const position = player.getComponent('Position')
        for (const air of this.airFamily.entityIterator) {
          const airPosition = air.getComponent('Position')
          const direction = position.sub(airPosition)
          const r = direction.lengthSq()
          const rigidBody = air.getComponent('RigidBody')
          rigidBody.acceleration = rigidBody.acceleration.add(direction.normalize().mul(10000 / r))
        }
      }
    }
  }

  private static footCollisionCallback(player: Collider, other: Collider): void {
    if (!other.isSensor) {
      player.component.entity.getComponent('Player').landing = true
    }
  }
}
