import { Entity } from '@core/ecs/entity'
import { largeCoinAI } from '@game/ai/entity/coin/largeCoinAI'
import { AiComponent } from '@game/components/aiComponent'
import { ObjectEntityFactory } from '@game/entities/objectEntityFactory'

export default class CoinLargeFactory extends ObjectEntityFactory {
  public create(): Entity {
    const entity = super.create()

    entity.addComponent('Ai', new AiComponent(largeCoinAI(entity, this.world)))

    return entity
  }
}
