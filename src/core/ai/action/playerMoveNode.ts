import { BehaviourNode, NodeState } from '../behaviourNode'
import { Entity } from '../../ecs/entity'
import { KeyController } from '../../controller'

export class PlayerMoveNode implements BehaviourNode {
  public initState(): void {
    // 何もしない
  }
  public execute(entity: Entity): NodeState {
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
    if (velocity.y > 240) velocity.y = 240
    player.landing = false

    KeyController.onUpdateFinished()
    return NodeState.Success
  }
}