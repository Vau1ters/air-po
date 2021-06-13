import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { HorizonComponent } from '@game/components/horizonComponent'
import { MapObject } from '@game/map/mapBuilder'
import { ObjectEntityFactory } from './objectEntityFactory'

export class BackgroundFactory extends ObjectEntityFactory {
  public constructor(name: string, object: MapObject, world: World) {
    super(
      name,
      {
        ...object,
        width: 0,
        height: 0,
      },
      world
    )
  }

  public create(): Entity {
    const entity = super.create()
    entity.addComponent('Horizon', new HorizonComponent())

    return entity
  }
}
