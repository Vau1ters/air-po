import { BehaviourNode, Behaviour } from '../behaviourNode'
import { World } from '../../ecs/world'
import { Entity } from '../../ecs/entity'
import { MouseController } from '../../controller'
import { BulletFactory } from '../../entities/bulletFactory'
import { PlayerComponent } from '../../components/playerComponent'
import { AirHolderComponent } from '../../components/airHolderComponent'
import { application, windowSize } from '../../application'

export class PlayerGunShootNode extends BehaviourNode {
  static readonly CONSUME_SPEED = 10

  private entity: Entity
  private world: World
  private bulletFactory: BulletFactory

  public constructor(entity: Entity, world: World) {
    super()
    this.entity = entity
    this.world = world
    this.bulletFactory = new BulletFactory()
  }

  protected *behaviour(): Behaviour {
    if (MouseController.isMousePressing('Left')) {
      // 空気の消費
      const airHolder = this.entity.getComponent('AirHolder') as AirHolderComponent
      if (airHolder.currentQuantity >= PlayerGunShootNode.CONSUME_SPEED) {
        airHolder.consumeBy(PlayerGunShootNode.CONSUME_SPEED)

        // 弾を打つ
        this.bulletFactory.player = this.entity
        const player = this.entity.getComponent('Player') as PlayerComponent
        player.bulletAngle = this.calcAngle()
        this.world.addEntity(this.bulletFactory.create())
      }
    }

    yield
    return 'Success'
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
  }
}
