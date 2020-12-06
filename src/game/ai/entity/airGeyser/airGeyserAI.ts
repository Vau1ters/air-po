import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAny } from '@core/behaviour/composite'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { AirFactory } from '@game/entities/airFactory'
import { AirSystem } from '@game/systems/airSystem'
import { animateLoop } from '../common/action/animate'

const manageAir = function*(
  entity: Entity,
  world: World,
  options: {
    maxQuantity: number
    increaseRate: number
  }
): Behaviour<void> {
  const position = entity.getComponent('Position')
  const airEntity = new AirFactory()
    .setQuantity(AirSystem.AIR_SHRINK_QUANTITY_THRESHOLD * 2)
    .setPosition(position.x, position.y)
    .create()
  world.addEntity(airEntity)
  while (true) {
    const airComponent = airEntity.getComponent('Air')

    // 空気が消えてたら復活させる
    if (!world.hasEntity(entity) || !airComponent.alive) {
      airComponent.increase(AirSystem.AIR_SHRINK_QUANTITY_THRESHOLD * 2)
      world.addEntity(entity)
    }

    if (airComponent.quantity < options.maxQuantity) {
      airComponent.increase(options.increaseRate)
    }
    yield
  }
}

export const airGeyserAI = function(
  entity: Entity,
  world: World,
  options: {
    maxQuantity: number
    increaseRate: number
  }
): Behaviour<void> {
  return parallelAny([animateLoop(entity, 'Default'), manageAir(entity, world, options)])
}
