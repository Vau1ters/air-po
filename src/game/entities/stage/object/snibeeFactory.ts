import { Entity } from '@core/ecs/entity'
import { snibeeAI } from '@game/ai/entity/snibee/snibeeAI'
import { AiComponent } from '@game/components/aiComponent'
import { ObjectEntityFactory } from '@game/entities/objectEntityFactory'

export default class SnibeeFactory extends ObjectEntityFactory {
  public create(): Entity {
    const entity = super.create()

    entity.addComponent('Ai', new AiComponent(snibeeAI(entity, this.world)))
    return entity
  }
}
