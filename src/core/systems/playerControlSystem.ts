import { System } from '../ecs/system'
import { Entity } from '../ecs/entity'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'
import { KeyController } from '../controller'
import { PlayerComponent } from '../components/playerComponent'
import { RigidBodyComponent } from '../components/rigidBodyComponent'
import { Collider } from '../components/colliderComponent'
import { HorizontalDirectionComponent } from '../components/directionComponent'
import { BulletFactory } from '../entities/bulletFactory'

export class PlayerControlSystem extends System {
  private family: Family
  private bulletFactory: BulletFactory

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world)
      .include('Player', 'RigidBody')
      .build()
    this.family.entityAddedEvent.addObserver(this.entityAdded)

    this.bulletFactory = new BulletFactory()
  }

  private entityAdded(entity: Entity): void {
    const collider = entity.getComponent('Collider')
    if (collider) {
      for (const c of collider.colliders) {
        if (c.tag == 'foot') {
          c.callback = PlayerControlSystem.footCollisionCallback
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
      if (KeyController.isKeyPressing('Z')) {
        this.bulletFactory.player = entity
        player.bulletAngle = this.calcAngle()
        this.world.addEntity(this.bulletFactory.create())
      }
      player.landing = false
    }

    KeyController.onUpdateFinished()
  }

  private calcAngle(): number {
    if (KeyController.isKeyPressing('Down')) {
      if (
        KeyController.isKeyPressing('Left') ||
        KeyController.isKeyPressing('Right')
      ) {
        return +45
      } else {
        return +90
      }
    }
    if (KeyController.isKeyPressing('Up')) {
      if (
        KeyController.isKeyPressing('Left') ||
        KeyController.isKeyPressing('Right')
      ) {
        return -45
      } else {
        return -90
      }
    }
    return 0
  }

  private static footCollisionCallback(player: Collider, other: Collider): void {
    if (!other.isSensor) {
      const pc = player.component.entity.getComponent('Player')
      if (pc) pc.landing = true
    }
  }
}
