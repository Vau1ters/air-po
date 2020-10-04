import { Behaviour } from '../behaviour'
import { World } from '../../ecs/world'
import { Entity } from '../../ecs/entity'
import { MouseController } from '../../systems/controlSystem'
import { BulletFactory } from '../../entities/bulletFactory'
import * as Sound from '../../sound/sound'
import { wait } from './wait'
import { Vec2 } from '../../math/vec2'
import { windowSize } from '../../application'

const SETTING = {
  CONSUME_SPEED: 2,
  COOL_TIME: 20,
}
const bulletFactory = new BulletFactory()
bulletFactory.offset.y = 1

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
      bulletFactory.setDirection(
        MouseController.position.sub(new Vec2(windowSize.width / 2, windowSize.height / 2))
      )
      world.addEntity(bulletFactory.create())
    }

    yield* wait(SETTING.COOL_TIME)
  }
}
