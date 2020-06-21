import { System } from '../ecs/system'
import { Entity } from '../ecs/entity'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'
import { KeyController } from '../controller'
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
      }
    }
  }

  public update(): void {
    for (const entity of this.family.entityIterator) {
      const player = entity.getComponent('Player')
      const animState = entity.getComponent('AnimationState')
      const direction = entity.getComponent('HorizontalDirection')
      console.log(animState.state)

      const body = entity.getComponent('RigidBody')

      const velocity = body.velocity

      if (KeyController.isKeyPressing('Right')) {
        if (velocity.x < 100) velocity.x += 10
        if (player.landing) animState.state = 'Walking'
        direction.looking = 'Right'
      } else if (KeyController.isKeyPressing('Left')) {
        if (velocity.x > -100) velocity.x -= 10
        if (player.landing) animState.state = 'Walking'
        direction.looking = 'Left'
      } else {
        if (velocity.x > 0) velocity.x -= Math.min(20, velocity.x)
        if (velocity.x < 0) velocity.x -= Math.max(-20, velocity.x)
        if (player.landing) animState.state = 'Standing'
      }
      if (player.landing) {
        velocity.y = 0
      }
      if (KeyController.isKeyPressing('Space') && player.landing) {
        velocity.y = -250
        animState.state = 'Jumping'
      }
      player.landing = false
    }

    KeyController.onUpdateFinished()
  }

  private static footCollisionCallback(player: Collider, other: Collider): void {
    if (!other.isSensor) {
      player.component.entity.getComponent('Player').landing = true
    }
  }
}
