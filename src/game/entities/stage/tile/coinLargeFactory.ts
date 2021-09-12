import { Entity } from '@core/ecs/entity'
import { largeCoinAI } from '@game/ai/entity/coin/largeCoinAI'
import { AiComponent } from '@game/components/aiComponent'
import { TileEntityFactory } from '@game/entities/tileEntityFactory'

export default class CoinLargeFactory extends TileEntityFactory {
  public create(): Entity {
    const entity = super.create()

    entity.addComponent('Ai', new AiComponent(largeCoinAI(entity, this.world)))

    return entity
  }
}
