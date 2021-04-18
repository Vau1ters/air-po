import { Behaviour } from '@core/behaviour/behaviour'
import { World } from '@core/ecs/world'
import { Entity } from '@core/ecs/entity'
import { AirFactory } from '@game/entities/object/airFactory'

export const emitAir = function*(entity: Entity, world: World, quantity: number): Behaviour<void> {
  const airFactory = new AirFactory(entity.getComponent('Position'), world)
  airFactory.setQuantity(quantity)
  world.addEntity(airFactory.create())
}
