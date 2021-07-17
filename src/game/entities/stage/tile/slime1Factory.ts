import { Entity } from '@core/ecs/entity'
import { slime1AI } from '@game/ai/entity/slime1/slime1AI'
import { AIComponent } from '@game/components/aiComponent'
import { AttackComponent } from '@game/components/attackComponent'
import { HorizontalDirectionComponent } from '@game/components/directionComponent'
import { HPComponent } from '@game/components/hpComponent'
import { SoundComponent } from '@game/components/soundComponent'
import { TileEntityFactory } from '@game/entities/tileEntityFactory'

export default class Slime1Factory extends TileEntityFactory {
  public create(): Entity {
    const entity = super.create()

    entity.addComponent('AI', new AIComponent(slime1AI(entity, this.world)))
    entity.addComponent('Attack', new AttackComponent(1, false))
    entity.addComponent('HP', new HPComponent(2, 2))
    entity.addComponent('HorizontalDirection', new HorizontalDirectionComponent(entity, 'Right'))
    entity.addComponent('Sound', new SoundComponent())
    return entity
  }
}
