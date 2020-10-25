import { Behaviour } from '../../behaviour'
import { World } from '../../../ecs/world'
import { Entity } from '../../../ecs/entity'
import { MouseController } from '../../../ecs/systems/controlSystem'
import { BulletFactory } from '../../../ecs/entities/bulletFactory'
import { application, windowSize } from '../../../application'
import * as Sound from '../../../sound/sound'
import { Vec2 } from '../../../math/vec2'
import { wait } from '../../wait'

const SETTING = {
  CONSUME_SPEED: 2,
  COOL_TIME: 20,
}
const bulletFactory = new BulletFactory()
bulletFactory.offset.y = 1

const mouseDirection = (): Vec2 => {
  const position = application.renderer.plugins.interaction.mouse.global
  const scale = application.stage.scale
  return new Vec2(
    position.x / scale.x - windowSize.width / 2,
    position.y / scale.y - windowSize.height / 2
  )
}

export const playerGunShoot = function*(entity: Entity, world: World): Behaviour<void> {
  while (true) {
    while (!MouseController.isMousePressed('Left')) yield

    // 空気の消費
    const airHolder = entity.getComponent('AirHolder')
    if (airHolder.currentQuantity >= SETTING.CONSUME_SPEED) {
      airHolder.consumeBy(SETTING.CONSUME_SPEED)

      Sound.play('shot')
      // 弾を打つ
      bulletFactory.setShooter(entity, 'player')
      bulletFactory.setDirection(mouseDirection())
      world.addEntity(bulletFactory.create())
    }

    yield* wait(SETTING.COOL_TIME)
  }
}