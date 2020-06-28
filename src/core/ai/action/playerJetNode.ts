import { BehaviourNode, NodeState } from '../behaviourNode'
import { Entity } from '../../ecs/entity'
import { KeyController } from '../../controller'
import { AirHolderComponent } from '../../components/airHolderComponent'

export class PlayerJetNode implements BehaviourNode {
  static readonly CONSUME_SPEED = 30

  public initState(): void {
    // 何もしない
  }
  public execute(entity: Entity): NodeState {
    const body = entity.getComponent('RigidBody')
    const airHolder = entity.getComponent('AirHolder') as AirHolderComponent
    const velocity = body.velocity

    const playerAngle = this.calcAngle()
    if (
      KeyController.isKeyPressing('Shift') &&
      playerAngle.r > 0 &&
      airHolder.currentQuantity > PlayerJetNode.CONSUME_SPEED
    ) {
      airHolder.consumeBy(PlayerJetNode.CONSUME_SPEED)

      velocity.x = playerAngle.x * 160
      velocity.y = playerAngle.y * 200
    }

    return NodeState.Success
  }

  private calcAngle(): { x: number; y: number; r: number } {
    const angle = {
      x: 0,
      y: 0,
      r: 0,
    }

    if (KeyController.isKeyPressing('Left')) {
      angle.x -= 1
    }
    if (KeyController.isKeyPressing('Right')) {
      angle.x += 1
    }
    if (KeyController.isKeyPressing('Up')) {
      angle.y -= 1
    }
    if (KeyController.isKeyPressing('Down')) {
      angle.y += 1
    }

    const r = Math.sqrt(angle.x * angle.x + angle.y * angle.y)
    angle.r = r
    if (r > 0) {
      angle.x /= r
      angle.y /= r
    }

    return angle
  }
}
