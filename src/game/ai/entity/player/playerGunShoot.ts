import { Behaviour } from '../../../../core/behaviour/behaviour'
import { World } from '../../../../core/ecs/world'
import { Entity } from '../../../../core/ecs/entity'
import { MouseController } from '@game/systems/controlSystem'
import { BulletFactory } from '@game/entities/bulletFactory'
import { application, windowSize } from '../../../../core/application'
import * as Sound from '../../../../core/sound/sound'
import { Vec2 } from '../../../../core/math/vec2'
import { wait } from '../../../../core/behaviour/wait'

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
