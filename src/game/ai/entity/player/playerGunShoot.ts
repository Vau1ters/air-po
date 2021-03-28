import { Behaviour } from '@core/behaviour/behaviour'
import { World } from '@core/ecs/world'
import { Entity } from '@core/ecs/entity'
import { MouseController } from '@game/systems/controlSystem'
import { BulletFactory } from '@game/entities/bulletFactory'
import * as Sound from '@core/sound/sound'
import { wait } from '@core/behaviour/wait'
import { Vec2 } from '@core/math/vec2'
import { windowSize } from '@core/application'

const SETTING = {
  CONSUME_SPEED: 2,
  COOL_TIME: 20,
}
const bulletFactory = new BulletFactory()
bulletFactory.offset.y = 1

export const playerGunShoot = function*(entity: Entity, world: World): Behaviour<void> {
  while (true) {
    while (!MouseController.isMousePressed('Left')) {
      yield
    }

    // 空気の消費
    const airHolder = entity.getComponent('AirHolder')
    if (airHolder.quantity >= SETTING.CONSUME_SPEED) {
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
