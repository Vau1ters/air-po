import { Entity } from '../ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '../components/positionComponent'
import { AirComponent } from '../components/airComponent'
import { ColliderComponent } from '../components/colliderComponent'
import { Vec2 } from '../math/vec2'

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
    const position = new PositionComponent(this.position.x, this.position.y)
    const air = new AirComponent(this.quantity)
    const collider = new ColliderComponent(entity)

    entity.addComponent('Position', position)
    entity.addComponent('Air', air)
    entity.addComponent('Collider', collider)
    return entity
  }
}
