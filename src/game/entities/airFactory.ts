import { Entity } from '@core/ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '@game/components/positionComponent'
import { AirComponent } from '@game/components/airComponent'
import { Vec2 } from '@core/math/vec2'

export class AirFactory extends EntityFactory {
  private quantity = 10000

  private position: Vec2 = new Vec2(400, 300)

  public setQuantity(quantity: number): this {
    this.quantity = quantity
    return this
  }

  public setPosition(x: number, y: number): this {
    this.position = new Vec2(x, y)
    return this
  }

  public create(): Entity {
    const entity = new Entity()

    entity.addComponent('Position', new PositionComponent(this.position.x, this.position.y))
    entity.addComponent('Air', new AirComponent(this.quantity))

    return entity
  }
}
