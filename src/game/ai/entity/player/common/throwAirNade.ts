import { Behaviour } from '@core/behaviour/behaviour'
import { World } from '@core/ecs/world'
import { Entity } from '@core/ecs/entity'
import { wait } from '@core/behaviour/wait'
import { MouseController } from '@game/systems/controlSystem'
import airNadeSetting from '@res/entity/airNade.json'
import { AirNadeFactory } from '@game/entities/airNadeFactory'

const SETTING = {
  COOL_TIME: 20,
}

export const throwAirNade = function* (player: Entity, world: World): Behaviour<void> {
  const airHolder = player.getComponent('AirHolder')
  const sound = player.getComponent('Sound')
  while (true) {
    yield* wait.until(
      () =>
        MouseController.isMousePressed('Left') &&
        airHolder.quantity >= airNadeSetting.airHolder.maxQuantity
    )
    airHolder.consumeBy(airNadeSetting.airHolder.maxQuantity)

    sound.addSound('shot')
    // 弾を打つ
    const targetPos = player.getComponent('Player').targetPosition
    const airNade = new AirNadeFactory(player, world, targetPos).create()
    world.addEntity(airNade)
    yield* wait.frame(SETTING.COOL_TIME)
  }
}
