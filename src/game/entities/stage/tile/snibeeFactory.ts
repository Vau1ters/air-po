import { Entity } from '@core/ecs/entity'
import { snibeeAI } from '@game/ai/entity/snibee/snibeeAI'
import { AiComponent } from '@game/components/aiComponent'
import { AttackComponent } from '@game/components/attackComponent'
import { HorizontalDirectionComponent } from '@game/components/horizontalDirectionComponent'
import { SoundComponent } from '@game/components/soundComponent'
import { TileEntityFactory } from '@game/entities/tileEntityFactory'

export default class SnibeeFactory extends TileEntityFactory {
  public create(): Entity {
    const entity = super.create()

    entity.addComponent('Ai', new AiComponent(snibeeAI(entity, this.world)))
    entity.addComponent('Attack', new AttackComponent(1, false))
    entity.addComponent('HorizontalDirection', new HorizontalDirectionComponent(entity, 'Right'))
    entity.addComponent('Sound', new SoundComponent())
    return entity
  }
}
