import { Behaviour } from '../../behaviour/behaviour'
import { World } from '../../ecs/world'
import { Entity } from '../../ecs/entity'
import { AirFactory } from '../../entities/airFactory'

const airFactory = new AirFactory()

export const emitAir = function*(entity: Entity, world: World, quantity: number): Behaviour<void> {
  airFactory.setQuantity(quantity)
  const pos = entity.getComponent('Position')
  airFactory.setPosition(pos.x, pos.y)
  world.addEntity(airFactory.create())
}
