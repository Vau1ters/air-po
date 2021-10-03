import { Entity } from '@core/ecs/entity'
import { PositionComponent } from '@game/components/positionComponent'
import { EntityFactory } from './entityFactory'

export class InventoryStateFactory extends EntityFactory {
  public create(): Entity {
    const entity = new Entity()

    entity.addComponent('Position', new PositionComponent())

    return entity
  }
}
