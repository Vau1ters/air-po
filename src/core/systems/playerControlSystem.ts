import { System } from '../ecs/system'
import { Entity } from '../ecs/entity'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'
import { KeyController } from '../controller'
import { PlayerComponent } from '../components/playerComponent'
import { RigidBodyComponent } from '../components/rigidBodyComponent'
import {
  Collider,
  AirCollider,
  ColliderComponent,
} from '../components/colliderComponent'
import { HorizontalDirectionComponent } from '../components/directionComponent'
import { BulletFactory } from '../entities/bulletFactory'
import { assert } from '../../utils/assertion'
import { AirHolderComponent } from '../components/airHolderComponent'
import { AirComponent } from '../components/airComponent'
import { PositionComponent } from '../components/positionComponent'

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
        if (c.tag === 'playerFoot') {
          c.callback = PlayerControlSystem.footCollisionCallback
        }
        if (c.tag == 'playerBody') {
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
      if (KeyController.isKeyPressing('Z')) {
        this.bulletFactory.player = entity
        player.bulletAngle = this.calcAngle()
        this.world.addEntity(this.bulletFactory.create())
      }
      player.landing = false

      // air consume
      const airHolder = entity.getComponent('AirHolder')
      assert(airHolder instanceof AirHolderComponent)
      airHolder.consume(player.status.air.consumeSpeed)
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

  private static footCollisionCallback(
    player: Collider,
    other: Collider
  ): void {
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
      const player = playerCollider.component.entity.getComponent(
        'Player'
      ) as PlayerComponent
      const pp = playerCollider.component.entity.getComponent(
        'Position'
      ) as PositionComponent
      const airHolder = playerCollider.component.entity.getComponent(
        'AirHolder'
      ) as AirHolderComponent
      const airs = Array.from(
        ((otherCollider.component.entity.getComponent(
          'Collider'
        ) as ColliderComponent).colliders[0] as AirCollider).airFamily.entities
      )
        .filter((a: Entity) => (a.getComponent('Air') as AirComponent).hit)
        .sort((a, b) => {
          const aa = a.getComponent('Air') as AirComponent
          const pa = a.getComponent('Position') as PositionComponent
          const ab = b.getComponent('Air') as AirComponent
          const pb = b.getComponent('Position') as PositionComponent
          return (
            ab.quantity / pb.sub(pp).lengthSq() -
            aa.quantity / pa.sub(pp).lengthSq()
          )
        })
      const air = airs[0].getComponent('Air') as AirComponent
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
