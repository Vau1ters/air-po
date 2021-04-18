import { Behaviour } from '@core/behaviour/behaviour'
import { World } from '@core/ecs/world'
import { Entity } from '@core/ecs/entity'
import { AirFactory } from '@game/entities/airFactory'

export const emitAir = function*(entity: Entity, world: World, quantity: number): Behaviour<void> {
  world.addEntity(new AirFactory(entity.getComponent('Position'), quantity).create())
}
