import { Entity } from '@core/ecs/entity'
import { poisonousTulipAI } from '@game/ai/entity/poisonousTulip/poisonousTulipAI'
import { AiComponent } from '@game/components/aiComponent'
import { TileEntityFactory } from '@game/entities/tileEntityFactory'

export default class PoisonousTulipFactory extends TileEntityFactory {
  public create(): Entity {
    const entity = super.create()

    entity.addComponent('Ai', new AiComponent(poisonousTulipAI(entity, this.world)))

    return entity
  }
}
