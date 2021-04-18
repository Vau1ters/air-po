import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { AirComponent } from '@game/components/airComponent'
import { MapObjectInfo, ObjectEntityFactory } from './objectEntityFactory'

export class AirFactory extends ObjectEntityFactory {
  private quantity = 10000

  constructor(arg: MapObjectInfo | Vec2, world: World) {
    super('air', arg instanceof Vec2 ? { x: arg.x, y: arg.y, width: 0, height: 0 } : arg, world)
  }

  public setQuantity(quantity: number): this {
    this.quantity = quantity
    return this
  }

  public create(): Entity {
    const entity = super.create()

    entity.addComponent('Air', new AirComponent(this.quantity))

    return entity
  }
}
