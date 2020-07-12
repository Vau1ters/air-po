import { BehaviourNode, NodeState } from '../behaviourNode'
import { Entity } from '../../ecs/entity'
import { KeyController } from '../../controller'
import { Vec2 } from '../../math/vec2'

export class PlayerJetNode implements BehaviourNode {
  static readonly CONSUME_SPEED = 10

  public initState(): void {
    // 何もしない
  }

  public execute(entity: Entity): NodeState {
    const body = entity.getComponent('RigidBody')
    const airHolder = entity.getComponent('AirHolder')
    const velocity = body.velocity

    const playerAngle = this.calcPlayerAngle()
    if (
      KeyController.isKeyPressing('Shift') &&
      playerAngle.lengthSq() > 0 &&
      airHolder.currentQuantity >= PlayerJetNode.CONSUME_SPEED
    ) {
      velocity.x = playerAngle.x * 160
      velocity.y = playerAngle.y * 200
    }

    return NodeState.Success
  }

  private calcPlayerAngle(): Vec2 {
    const angle = new Vec2()

    if (KeyController.isKeyPressing('A')) {
      angle.x -= 1
    }
    if (KeyController.isKeyPressing('D')) {
      angle.x += 1
    }
    if (KeyController.isKeyPressing('W')) {
      angle.y -= 1
    }
    if (KeyController.isKeyPressing('S')) {
      angle.y += 1
    }

    return angle.normalize()
  }
}
