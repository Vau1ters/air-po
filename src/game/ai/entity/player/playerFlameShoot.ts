import { Behaviour } from '@core/behaviour/behaviour'
import { World } from '@core/ecs/world'
import { Entity } from '@core/ecs/entity'
import { MouseController } from '@game/systems/controlSystem'
// import * as Sound from '@core/sound/sound'
import { wait } from '@core/behaviour/wait'
import { Vec2 } from '@core/math/vec2'
import { windowSize } from '@core/application'
import { FlameFactory } from '@game/entities/flameFactory'

const SETTING = {
  CONSUME_SPEED: 1,
  FIRE_RATE: 5,
  ANGLE_RANGE: Math.PI / 12.0,
}

export const playerFlameShoot = function*(entity: Entity, world: World): Behaviour<void> {
  const flameFactory = new FlameFactory(world)
  flameFactory.offset.y = 1

  while (true) {
    const equipment = entity.getComponent('Equipment')
    while (equipment.weapons.flamethrower && MouseController.isMousePressing('Right')) {
      // 空気の消費
      const airHolder = entity.getComponent('AirHolder')
      if (airHolder.quantity >= SETTING.CONSUME_SPEED) {
        airHolder.consumeBy(SETTING.CONSUME_SPEED)

        // 弾を打つ
        flameFactory.setShooter(entity, 'player')
        flameFactory.setDirection(
          MouseController.position.sub(new Vec2(windowSize.width / 2, windowSize.height / 2))
        )
        flameFactory.angle += (Math.random() - 0.5) * SETTING.ANGLE_RANGE
        world.addEntity(flameFactory.create())
      }

      yield* wait(SETTING.FIRE_RATE)
    }

    yield
  }
}
