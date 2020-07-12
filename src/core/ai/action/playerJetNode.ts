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
      KeyController.isActionPressing('Jet') &&
      playerAngle.lengthSq() > 0 &&
      airHolder.currentQuantity >= PlayerJetNode.CONSUME_SPEED
    ) {
      velocity.x = playerAngle.x * 160
      velocity.y = playerAngle.y * 200
      airHolder.consumeBy(PlayerJetNode.CONSUME_SPEED)
    }

    return NodeState.Success
  }

  private calcPlayerAngle(): Vec2 {
    const angle = new Vec2()

    if (KeyController.isActionPressing('MoveLeft')) {
      angle.x -= 1
    }
    if (KeyController.isActionPressing('MoveRight')) {
      angle.x += 1
    }
    if (KeyController.isActionPressing('MoveUp')) {
      angle.y -= 1
    }
    if (KeyController.isActionPressing('MoveDown')) {
      angle.y += 1
    }

    return angle.normalize()
  }
}
