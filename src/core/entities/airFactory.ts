import { Entity } from '../ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '../components/positionComponent'
import { AirComponent } from '../components/airComponent'

export class AirFactory extends EntityFactory {
  public create(): Entity {
    const entity = new Entity()
    const position = new PositionComponent(400, 300)
    const air: AirComponent = {
      quantity: 100,
    }

    entity.addComponent('Position', position)
    entity.addComponent('Air', air)
    return entity
  }
}
