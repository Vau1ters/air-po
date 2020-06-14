import { System } from '../ecs/system'
import { Entity } from '../ecs/entity'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'
import { KeyController } from '../controller'
import { Collider, AirCollider } from '../components/colliderComponent'
import { BulletFactory } from '../entities/bulletFactory'
import { assert } from '../../utils/assertion'
import { AirHolderComponent } from '../components/airHolderComponent'

export class PlayerControlSystem extends System {
  private family: Family
  private bulletFactory: BulletFactory

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('Player', 'RigidBody').build()
    this.family.entityAddedEvent.addObserver(this.entityAdded)

    this.bulletFactory = new BulletFactory()
  }

  private entityAdded(entity: Entity): void {
    const collider = entity.getComponent('Collider')
    if (collider) {
      for (const c of collider.colliders) {
        if (c.tag.has('playerFoot')) {
          c.callback = PlayerControlSystem.footCollisionCallback
        }
        if (c.tag.has('playerBody')) {
          c.callback = PlayerControlSystem.bodySensor
        }
      }
    }
  }

  public update(): void {
    for (const entity of this.family.entityIterator) {
      const player = entity.getComponent('Player')
      const direction = entity.getComponent('HorizontalDirection')
      console.log(player.state)

      const body = entity.getComponent('RigidBody')

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
      if (KeyController.isKeyPressing('Left') || KeyController.isKeyPressing('Right')) {
        return +45
      } else {
        return +90
      }
    }
    if (KeyController.isKeyPressing('Up')) {
      if (KeyController.isKeyPressing('Left') || KeyController.isKeyPressing('Right')) {
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

  private static bodySensor(playerCollider: Collider, otherCollider: Collider): void {
    // collect air
    if (otherCollider.tag.has('air')) {
      assert(otherCollider instanceof AirCollider)

      const player = playerCollider.component.entity.getComponent('Player')
      const position = playerCollider.component.entity.getComponent('Position')
      const airHolder = playerCollider.component.entity.getComponent('AirHolder')

      const hitAirs: Entity[] = otherCollider.airFamily.entityArray.filter(
        (a: Entity) => a.getComponent('Air').hit
      )
      const nearestAir = hitAirs.reduce((a, b) => {
        const aa = a.getComponent('Air')
        const pa = a.getComponent('Position')
        const ab = b.getComponent('Air')
        const pb = b.getComponent('Position')
        if (pa.sub(position).lengthSq() / aa.quantity < pb.sub(position).lengthSq() / ab.quantity) {
          return a
        } else {
          return b
        }
      })
      const air = nearestAir.getComponent('Air')
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
