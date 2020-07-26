import { Behaviour, BehaviourNode } from '../behaviourNode'
import { World } from '../../ecs/world'
import { Entity } from '../../ecs/entity'
import { AirFactory } from '../../entities/airFactory'

export const emitAirNode = (quantity: number): BehaviourNode => {
  const airFactory = new AirFactory().setQuantity(quantity)
  return function*(entity: Entity, world: World): Behaviour {
    const pos = entity.getComponent('Position')
    airFactory.setPosition(pos.x, pos.y)
    world.addEntity(airFactory.create())
    return 'Success'
  }
}
