import { BehaviourNode, Behaviour } from '../behaviourNode'
import { Entity } from '../../ecs/entity'
import { KeyController } from '../../controller'
import { Vec2 } from '../../math/vec2'

export class PlayerJetNode extends BehaviourNode {
  static readonly CONSUME_SPEED = 10
  static readonly JET_SPEED = 180

  private entity: Entity

  public constructor(entity: Entity) {
    super()
    this.entity = entity
  }

  protected *behaviour(): Behaviour {
    const body = this.entity.getComponent('RigidBody')
    const airHolder = this.entity.getComponent('AirHolder')
    const velocity = body.velocity

    const playerAngle = this.calcPlayerAngle()
    if (
      KeyController.isActionPressing('Jet') &&
      playerAngle.lengthSq() > 0 &&
      airHolder.currentQuantity >= PlayerJetNode.CONSUME_SPEED
    ) {
      velocity.x = playerAngle.x * PlayerJetNode.JET_SPEED
      velocity.y = playerAngle.y * PlayerJetNode.JET_SPEED
      airHolder.consumeBy(PlayerJetNode.CONSUME_SPEED)
    }

    yield
    return 'Success'
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
