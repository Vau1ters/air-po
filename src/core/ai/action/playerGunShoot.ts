import { Behaviour } from '../behaviour'
import { World } from '../../ecs/world'
import { Entity } from '../../ecs/entity'
import { MouseController } from '../../systems/controlSystem'
import { BulletFactory } from '../../entities/bulletFactory'
import { PlayerComponent } from '../../components/playerComponent'
import { AirHolderComponent } from '../../components/airHolderComponent'
import { application, windowSize } from '../../application'

const SETTING = {
  CONSUME_SPEED: 10,
}
const bulletFactory = new BulletFactory()

const calcAngle = (): number => {
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

export const playerGunShoot = function*(entity: Entity, world: World): Behaviour<void> {
  if (MouseController.isMousePressing('Left')) {
    // 空気の消費
    const airHolder = entity.getComponent('AirHolder') as AirHolderComponent
    if (airHolder.currentQuantity >= SETTING.CONSUME_SPEED) {
      airHolder.consumeBy(SETTING.CONSUME_SPEED)

      // 弾を打つ
      bulletFactory.player = entity
      const player = entity.getComponent('Player') as PlayerComponent
      player.bulletAngle = calcAngle()
      world.addEntity(bulletFactory.create())
    }
  }
}
