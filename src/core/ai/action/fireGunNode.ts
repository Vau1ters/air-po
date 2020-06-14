import { BehaviourNode, NodeState } from '../behaviourNode'
import { World } from '../../ecs/world'
import { Entity } from '../../ecs/entity'
import { KeyController } from '../../controller'
import { BulletFactory } from '../../entities/bulletFactory'
import { PlayerComponent } from '../../components/playerComponent'
import { AirHolderComponent } from '../../components/airHolderComponent'

export class FireGunNode implements BehaviourNode {
  static readonly CONSUME_SPEED = 10
  private bulletFactory: BulletFactory

  public constructor() {
    this.bulletFactory = new BulletFactory()
  }
  public initState(): void {
    // 何もしない
  }

  public execute(entity: Entity, world: World): NodeState {
    if (KeyController.isKeyPressing('Z')) {
      // 空気の消費
      const airHolder = entity.getComponent('AirHolder') as AirHolderComponent
      airHolder.consume(FireGunNode.CONSUME_SPEED)

      // 弾を打つ
      this.bulletFactory.player = entity
      const player = entity.getComponent('Player') as PlayerComponent
      player.bulletAngle = this.calcAngle()
      world.addEntity(this.bulletFactory.create())
    }
    return NodeState.Success
  }

  private calcAngle(): number {
    if (KeyController.isKeyPressing('Down')) {
      if (
        KeyController.isKeyPressing('Left') ||
        KeyController.isKeyPressing('Right')
      ) {
        return +45
      } else {
        return +90
      }
    }
    if (KeyController.isKeyPressing('Up')) {
      if (
        KeyController.isKeyPressing('Left') ||
        KeyController.isKeyPressing('Right')
      ) {
        return -45
      } else {
        return -90
      }
    }
    return 0
  }
}
