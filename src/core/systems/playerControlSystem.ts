import { System } from '../ecs/system'
import { Entity } from '../ecs/entity'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'
import { KeyController } from '../controller'
import { PlayerComponent } from '../components/playerComponent'
import { RigidBodyComponent } from '../components/rigidBodyComponent'
import { Collider } from '../components/colliderComponent'

export class PlayerControlSystem extends System {
  private family: Family

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('Player').build()
    this.family.entityAddedEvent.addObserver(this.entityAdded)
  }

  private entityAdded(entity: Entity): void {
    const collider = entity.getComponent('Collider')
    if (collider) {
      for (const c of collider.colliders) {
        if (c.tag == 'foot') {
          c.callback = PlayerControlSystem.footSensor
        }
      }
    }
  }

  public update(): void {
    for (const entity of this.family.entities) {
      const player = entity.getComponent('Player') as PlayerComponent
      console.log(player.jumpState)

      const body = entity.getComponent('RigidBody') as RigidBodyComponent

      const velocity = body.velocity
      if (velocity) {
        if (KeyController.isKeyPressing('Right')) {
          if (velocity.x < 200) velocity.x += 20
        } else if (KeyController.isKeyPressing('Left')) {
          if (velocity.x > -200) velocity.x -= 20
        } else {
          if (velocity.x > 0) velocity.x -= Math.min(20, velocity.x)
          if (velocity.x < 0) velocity.x -= Math.max(-20, velocity.x)
        }
        if (
          KeyController.isKeyPressing('Space') &&
          player.jumpState === 'Standing'
        ) {
          velocity.y = -600
          player.jumpState = 'Jumping'
        }
        if (player.jumpState === 'Standing') {
          velocity.y = 0
        }
      }
      player.jumpState = 'Jumping'
    }

    KeyController.onUpdateFinished()
  }

  private static footSensor(player: Collider, other: Collider): void {
    if (!other.isSensor) {
      const pc = player.component.entity.getComponent('Player')
      if (pc) pc.jumpState = 'Standing'
    }
  }
}
