import { Entity } from '@core/ecs/entity'
import { poisonousTulipAI } from '@game/ai/entity/poisonousTulip/poisonousTulipAI'
import { AiComponent } from '@game/components/aiComponent'
import { HpComponent } from '@game/components/hpComponent'
import { TileEntityFactory } from '@game/entities/tileEntityFactory'

export default class PoisonousTulipFactory extends TileEntityFactory {
  public create(): Entity {
    const entity = super.create()

    entity.addComponent('Ai', new AiComponent(poisonousTulipAI(entity, this.world)))
    entity.addComponent('Hp', new HpComponent(5, 5))

    return entity
  }
}
