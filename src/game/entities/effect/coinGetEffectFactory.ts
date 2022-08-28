import { Entity } from '@core/ecs/entity'
import { EntityFactory } from '../entityFactory'
import { AiComponent } from '@game/components/aiComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { World } from '@core/ecs/world'
import { coinGetEffectAI } from '@game/ai/entity/coin/coinGetEffectAI'
import { loadEntity } from '../loader/EntityLoader'
import { GamingState } from '@game/ai/entity/coin/largeCoinAI'

export class CoinGetEffectFactory extends EntityFactory {
  public constructor(
    private coinEntity: Entity,
    private world: World,
    private state: GamingState,
    private index: number
  ) {
    super()
  }

  public create(): Entity {
    const pos = this.coinEntity.getComponent('Position')

    const entity = loadEntity('coinLargeFragment')

    entity.addComponent('Position', new PositionComponent(pos.x, pos.y))
    entity.addComponent(
      'Ai',
      new AiComponent(entity, coinGetEffectAI(entity, this.world, this.state, this.index))
    )

    return entity
  }
}
