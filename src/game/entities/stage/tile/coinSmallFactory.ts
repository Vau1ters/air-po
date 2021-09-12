import { Entity } from '@core/ecs/entity'
import { smallCoinAI } from '@game/ai/entity/coin/smallCoinAI'
import { AiComponent } from '@game/components/aiComponent'
import { TileEntityFactory } from '@game/entities/tileEntityFactory'

export default class CoinSmallFactory extends TileEntityFactory {
  public create(): Entity {
    const entity = super.create()

    entity.addComponent('Ai', new AiComponent(smallCoinAI(entity, this.world)))

    return entity
  }
}
