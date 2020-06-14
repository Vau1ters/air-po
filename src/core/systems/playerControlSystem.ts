import { System } from '../ecs/system'
import { Entity } from '../ecs/entity'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'
import { KeyController } from '../controller'
import { PlayerComponent } from '../components/playerComponent'
import { RigidBodyComponent } from '../components/rigidBodyComponent'
import { Collider, AirCollider } from '../components/colliderComponent'
import { HorizontalDirectionComponent } from '../components/directionComponent'
import { assert } from '../../utils/assertion'
import { AirHolderComponent } from '../components/airHolderComponent'
import { AirComponent } from '../components/airComponent'
import { PositionComponent } from '../components/positionComponent'

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
    for (const entity of this.family.entityIterator) {
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
      assert(airHolder instanceof AirHolderComponent)
      airHolder.consume(player.status.air.consumeSpeed)
    }

    KeyController.onUpdateFinished()
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
      assert(otherCollider instanceof AirCollider)

      const player = playerCollider.component.entity.getComponent(
        'Player'
      ) as PlayerComponent
      const position = playerCollider.component.entity.getComponent(
        'Position'
      ) as PositionComponent
      const airHolder = playerCollider.component.entity.getComponent(
        'AirHolder'
      ) as AirHolderComponent

      const hitAirs: Entity[] = otherCollider.airFamily.entityArray.filter(
        (a: Entity) => (a.getComponent('Air') as AirComponent).hit
      )
      const nearestAir = hitAirs.reduce((a, b) => {
        const aa = a.getComponent('Air') as AirComponent
        const pa = a.getComponent('Position') as PositionComponent
        const ab = b.getComponent('Air') as AirComponent
        const pb = b.getComponent('Position') as PositionComponent
        if (
          pa.sub(position).lengthSq() / aa.quantity <
          pb.sub(position).lengthSq() / ab.quantity
        ) {
          return a
        } else {
          return b
        }
      })
      const air = nearestAir.getComponent('Air') as AirComponent
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
