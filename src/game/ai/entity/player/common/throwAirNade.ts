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

export const throwAirNade = function*(entity: Entity, world: World): Behaviour<void> {
  if (!MouseController.isMousePressed('Left')) {
    yield
    return
  }
  // 空気の消費
  const airHolder = entity.getComponent('AirHolder')
  if (airHolder.quantity < airNadeSetting.airHolder.maxQuantity) return
  airHolder.consumeBy(airNadeSetting.airHolder.maxQuantity)

  entity.getComponent('Sound').addSound('shot')
  // 弾を打つ
  const airNade = new AirNadeFactory(entity, world).create()
  world.addEntity(airNade)
  yield* wait.frame(SETTING.COOL_TIME)
}
