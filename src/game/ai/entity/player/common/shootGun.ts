import { Behaviour } from '@core/behaviour/behaviour'
import { World } from '@core/ecs/world'
import { Entity } from '@core/ecs/entity'
import { BulletFactory } from '@game/entities/bulletFactory'
import { wait } from '@core/behaviour/wait'
import { MouseController } from '@game/systems/controlSystem'

const SETTING = {
  CONSUME_SPEED: 2,
  COOL_TIME: 20,
}
const bulletFactory = new BulletFactory()
bulletFactory.offset.y = 1

export const shootGun = function* (entity: Entity, world: World): Behaviour<void> {
  while (true) {
    const airHolder = entity.getComponent('AirHolder')
    yield* wait.until(
      () => MouseController.isMousePressed('Left') && airHolder.quantity >= SETTING.CONSUME_SPEED
    )
    airHolder.consumeBy(SETTING.CONSUME_SPEED)

    entity.getComponent('Sound').addSound('shot')
    // 弾を打つ
    bulletFactory.setShooter(entity, 'player')
    bulletFactory.setDirection(
      entity.getComponent('Player').targetPosition.sub(entity.getComponent('Position'))
    )
    world.addEntity(bulletFactory.create())
    entity.getComponent('Player').hasShot = true
    yield* wait.frame(SETTING.COOL_TIME)
  }
}
