import { Entity } from '@core/ecs/entity'
import { StaticComponent } from '@game/components/staticComponent'
import { TileEntityFactory } from '@game/entities/tileEntityFactory'

export default class NeedleFloorFactory extends TileEntityFactory {
  public create(): Entity {
    const entity = super.create()
    entity.addComponent('Static', new StaticComponent())
    return entity
  }
}
