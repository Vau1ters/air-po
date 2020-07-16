import { Entity } from '../../ecs/entity'
import { KeyController, MouseController } from '../../controller'
import { BehaviourNode, ExecuteResult } from '../behaviour'

export class PlayerMoveNode extends BehaviourNode {
  private entity: Entity

  public constructor(entity: Entity) {
    super()
    this.entity = entity
  }

  protected async behaviour(): Promise<ExecuteResult> {
    const player = this.entity.getComponent('Player')
    const animState = this.entity.getComponent('AnimationState')
    const direction = this.entity.getComponent('HorizontalDirection')
    console.log(animState.state)

    const body = this.entity.getComponent('RigidBody')

    const velocity = body.velocity

    if (KeyController.isActionPressing('MoveRight')) {
      if (velocity.x < 100) velocity.x += 10
      if (player.landing) animState.state = 'Walking'
      direction.looking = 'Right'
    } else if (KeyController.isActionPressing('MoveLeft')) {
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
    if (KeyController.isActionPressing('Jump') && player.landing) {
      velocity.y = -250
      animState.state = 'Jumping'
    }
    player.landing = false

    KeyController.onUpdateFinished()
    MouseController.onUpdateFinished()

    return 'Success'
  }
}
