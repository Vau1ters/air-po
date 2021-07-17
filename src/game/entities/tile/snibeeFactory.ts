import { Entity } from '@core/ecs/entity'
import { snibeeAI } from '@game/ai/entity/snibee/snibeeAI'
import { AIComponent } from '@game/components/aiComponent'
import { AttackComponent } from '@game/components/attackComponent'
import { HorizontalDirectionComponent } from '@game/components/directionComponent'
import { HPComponent } from '@game/components/hpComponent'
import { SoundComponent } from '@game/components/soundComponent'
import { TileEntityFactory } from './tileEntityFactory'

export class SnibeeFactory extends TileEntityFactory {
  public create(): Entity {
    const entity = super.create()

    entity.addComponent('AI', new AIComponent(snibeeAI(entity, this.world)))
    entity.addComponent('Attack', new AttackComponent(1, false))
    entity.addComponent('HP', new HPComponent(2, 2))
    entity.addComponent('HorizontalDirection', new HorizontalDirectionComponent(entity, 'Right'))
    entity.addComponent('Sound', new SoundComponent())
    return entity
  }
}
