import { Entity } from '@core/ecs/entity'
import { EntityFactory } from '../entityFactory'
import { AiComponent } from '@game/components/aiComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { World } from '@core/ecs/world'
import { coinGetEffectAI } from '@game/ai/entity/coin/coinGetEffectAI'
import { GamingFilter } from '@game/filters/gamingFilter'
import { loadEntity } from '../loader/EntityLoader'

export class CoinGetEffectFactory extends EntityFactory {
  public constructor(
    private coinEntity: Entity,
    private world: World,
    private filter: GamingFilter,
    private index: number
  ) {
    super()
  }

  public create(): Entity {
    const pos = this.coinEntity.getComponent('Position')

    const entity = loadEntity('coinLargeFragment')
    entity.getComponent('Draw').filters = [this.filter]

    entity.addComponent('Position', new PositionComponent(pos.x, pos.y))
    entity.addComponent('Ai', new AiComponent(coinGetEffectAI(entity, this.world, this.index)))

    return entity
  }
}
