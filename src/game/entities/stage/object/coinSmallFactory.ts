import { Entity } from '@core/ecs/entity'
import { smallCoinAI } from '@game/ai/entity/coin/smallCoinAI'
import { AiComponent } from '@game/components/aiComponent'
import { ObjectEntityFactory } from '@game/entities/objectEntityFactory'

export default class CoinSmallFactory extends ObjectEntityFactory {
  public create(): Entity {
    const entity = super.create()

    entity.addComponent('Ai', new AiComponent(entity, smallCoinAI(entity, this.world)))

    return entity
  }
}
