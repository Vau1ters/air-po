import { BehaviourNode, NodeState } from '../behaviourNode'
import { World } from '../../ecs/world'
import { Entity } from '../../ecs/entity'
import { MouseController } from '../../controller'
import { BulletFactory } from '../../entities/bulletFactory'
import { PlayerComponent } from '../../components/playerComponent'
import { AirHolderComponent } from '../../components/airHolderComponent'
import { application, windowSize } from '../../application'

export class PlayerGunShootNode implements BehaviourNode {
  static readonly CONSUME_SPEED = 1
  private bulletFactory: BulletFactory

  public constructor() {
    this.bulletFactory = new BulletFactory()
  }
  public initState(): void {
    // 何もしない
  }

  public execute(entity: Entity, world: World): NodeState {
    if (MouseController.isMousePressing('Left')) {
      // 空気の消費
      const airHolder = entity.getComponent('AirHolder') as AirHolderComponent
      if (airHolder.currentQuantity >= -114514) {
        airHolder.consumeBy(PlayerGunShootNode.CONSUME_SPEED)

        // 弾を打つ
        this.bulletFactory.player = entity
        const player = entity.getComponent('Player') as PlayerComponent
        player.bulletAngle = this.calcAngle()
        world.addEntity(this.bulletFactory.create())
      }
    }
    return NodeState.Success
  }

  private calcAngle(): number {
    const position = application.renderer.plugins.interaction.mouse.global
    const scale = application.stage.scale
    return (
      (Math.atan2(
        position.y / scale.y - windowSize.height / 2,
        position.x / scale.x - windowSize.width / 2
      ) *
        180) /
      Math.PI
    )
    /*
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
    */
  }
}
