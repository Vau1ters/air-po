import { Behaviour } from '@core/behaviour/behaviour'
import { World } from '@core/ecs/world'
import { Entity } from '@core/ecs/entity'
import { AirComponent } from '@game/components/airComponent'

export const emitAir = function*(entity: Entity, world: World, quantity: number): Behaviour<void> {
  const air = new Entity()
  air.addComponent('Position', entity.getComponent('Position').copy())
  air.addComponent('Air', new AirComponent(quantity))
  world.addEntity(air)
}
