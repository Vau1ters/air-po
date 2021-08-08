import { Entity } from '@core/ecs/entity'
import { slime1AI } from '@game/ai/entity/slime1/slime1AI'
import { AiComponent } from '@game/components/aiComponent'
import { TileEntityFactory } from '@game/entities/tileEntityFactory'

export default class Slime1Factory extends TileEntityFactory {
  public create(): Entity {
    const entity = super.create()

    entity.addComponent('Ai', new AiComponent(slime1AI(entity, this.world)))
    return entity
  }
}
