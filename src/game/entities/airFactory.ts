import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { AirComponent } from '@game/components/airComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { EntityFactory } from './entityFactory'

export class AirFactory extends EntityFactory {
  constructor(private pos: Vec2, private quantity: number) {
    super()
  }

  create(): Entity {
    const entity = new Entity()
    entity.addComponent('Position', new PositionComponent(this.pos.x, this.pos.y))
    entity.addComponent('Air', new AirComponent(this.quantity))
    return entity
  }
}
