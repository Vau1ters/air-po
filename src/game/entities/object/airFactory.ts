import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { AirComponent } from '@game/components/airComponent'
import { MapObject } from '@game/map/mapBuilder'
import { ObjectEntityFactory } from './objectEntityFactory'

export class AirFactory extends ObjectEntityFactory {
  constructor(name: string, private object: MapObject, world: World) {
    super(name, ObjectEntityFactory.calcPosition(object), world)
  }

  public create(): Entity {
    const entity = super.create()

    const quantity = this.object.width / 2
    entity.addComponent('Air', new AirComponent(quantity))

    return entity
  }
}
