import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { AirFactory } from '@game/entities/airFactory'

export const airTotemAI = function*(
  entity: Entity,
  world: World,
  options: {
    maxQuantity: number
    increaseRate: number
  }
): Behaviour<void> {
  const position = entity.getComponent('Position')
  const airEntity = new AirFactory()
    .setQuantity(100)
    .setPosition(position.x, position.y)
    .create()
  world.addEntity(airEntity)
  while (true) {
    const airComponent = airEntity.getComponent('Air')
    if (airComponent.quantity < options.maxQuantity) {
      airComponent.increase(options.increaseRate)
    }
    yield
  }
}
