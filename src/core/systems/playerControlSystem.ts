import { System } from '../ecs/system'
import { Entity } from '../ecs/entity'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'
import { KeyController } from '../controller'
import { PlayerComponent } from '../components/playerComponent'
import { RigidBodyComponent } from '../components/rigidBodyComponent'
import { Collider } from '../components/colliderComponent'
import { HorizontalDirectionComponent } from '../components/directionComponent'

export class PlayerControlSystem extends System {
  private family: Family

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world)
      .include('Player', 'RigidBody')
      .build()
    this.family.entityAddedEvent.addObserver(this.entityAdded)
  }

  private entityAdded(entity: Entity): void {
    const collider = entity.getComponent('Collider')
    if (collider) {
      for (const c of collider.colliders) {
        if (c.tag == 'foot') {
          c.callback = PlayerControlSystem.footSensor
        }
        if (c.tag == 'body') {
          c.callback = PlayerControlSystem.bodySensor
        }
      }
    }
  }

  public update(): void {
    for (const entity of this.family.entities) {
      const player = entity.getComponent('Player') as PlayerComponent
      const direction = entity.getComponent(
        'HorizontalDirection'
      ) as HorizontalDirectionComponent
      console.log(player.state)

      const body = entity.getComponent('RigidBody') as RigidBodyComponent

      const velocity = body.velocity

      if (KeyController.isKeyPressing('Right')) {
        if (velocity.x < 100) velocity.x += 10
        if (player.landing) player.state = 'Walking'
        direction.looking = 'Right'
      } else if (KeyController.isKeyPressing('Left')) {
        if (velocity.x > -100) velocity.x -= 10
        if (player.landing) player.state = 'Walking'
        direction.looking = 'Left'
      } else {
        if (velocity.x > 0) velocity.x -= Math.min(20, velocity.x)
        if (velocity.x < 0) velocity.x -= Math.max(-20, velocity.x)
        if (player.landing) player.state = 'Standing'
      }
      if (player.landing) {
        velocity.y = 0
      }
      if (KeyController.isKeyPressing('Space') && player.landing) {
        velocity.y = -250
        player.state = 'Jumping'
      }
      player.landing = false

      // air consume
      const airHolder = entity.getComponent('AirHolder')
      if (airHolder) {
        airHolder.consume(player.status.air.consumeSpeed)
      }
    }

    KeyController.onUpdateFinished()
  }

  private static footSensor(player: Collider, other: Collider): void {
    if (!other.isSensor) {
      const pc = player.component.entity.getComponent('Player')
      if (pc) pc.landing = true
    }
  }

  private static bodySensor(
    playerCollider: Collider,
    otherCollider: Collider
  ): void {
    // collect air
    if (otherCollider.tag == 'air') {
      const player = playerCollider.component.entity.getComponent('Player')
      const airHolder = playerCollider.component.entity.getComponent(
        'AirHolder'
      )
      const air = otherCollider.component.entity.getComponent('Air')
      if (player && airHolder && air) {
        const collectSpeed = Math.min(
          player.status.air.collectSpeed,
          airHolder.maxQuantity - airHolder.currentQuantity,
          air.quantity
        )
        airHolder.collect(collectSpeed)
        air.decrease(collectSpeed)
      }
    }
  }
}
