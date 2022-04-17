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
  const targetPos = player.getComponent('Player').targetPosition

  if (!MouseController.isMousePressed('Left')) {
    yield
    return
  }
  // 空気の消費
  if (airHolder.quantity < airNadeSetting.airHolder.maxQuantity) {
    yield
    return
  }
  airHolder.consumeBy(airNadeSetting.airHolder.maxQuantity)

  sound.addSound('shot')

  // 弾を打つ
  const airNade = new AirNadeFactory(player, world, targetPos).create()
  world.addEntity(airNade)
  yield* wait.frame(SETTING.COOL_TIME)
}
