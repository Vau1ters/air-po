import { Entity } from '@core/ecs/entity'
import { LightComponent } from '@game/components/lightComponent'
import { TileEntityFactory } from '@game/entities/tileEntityFactory'

export default class MossFactory extends TileEntityFactory {
  public create(): Entity {
    const entity = super.create()
    entity.addComponent('Light', new LightComponent(0))
    return entity
  }
}
