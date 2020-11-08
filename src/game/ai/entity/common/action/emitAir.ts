import { Behaviour } from '@core/behaviour/behaviour'
import { World } from '@core/ecs/world'
import { Entity } from '@core/ecs/entity'
import { AirFactory } from '@game/entities/airFactory'

const airFactory = new AirFactory()

export const emitAir = function*(entity: Entity, world: World, quantity: number): Behaviour<void> {
  airFactory.setQuantity(quantity)
  const pos = entity.getComponent('Position')
  airFactory.setPosition(pos.x, pos.y)
  world.addEntity(airFactory.create())
}
