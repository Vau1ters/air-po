import { Entity } from '@core/ecs/entity'
import { AirComponent } from '@game/components/airComponent'
import { ObjectEntityFactory } from './objectEntityFactory'

export class AirFactory extends ObjectEntityFactory {
  public create(): Entity {
    const entity = super.create()

    const quantity = this.object.width / 2
    entity.addComponent('Air', new AirComponent(quantity))

    return entity
  }
}
