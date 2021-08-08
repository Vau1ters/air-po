import { Entity } from '@core/ecs/entity'
import { slime1AI } from '@game/ai/entity/slime1/slime1AI'
import { AiComponent } from '@game/components/aiComponent'
import { AttackComponent } from '@game/components/attackComponent'
import { HorizontalDirectionComponent } from '@game/components/horizontalDirectionComponent'
import { SoundComponent } from '@game/components/soundComponent'
import { TileEntityFactory } from '@game/entities/tileEntityFactory'

export default class Slime1Factory extends TileEntityFactory {
  public create(): Entity {
    const entity = super.create()

    entity.addComponent('Ai', new AiComponent(slime1AI(entity, this.world)))
    entity.addComponent('Attack', new AttackComponent(1, false))
    entity.addComponent('HorizontalDirection', new HorizontalDirectionComponent(entity, 'Right'))
    entity.addComponent('Sound', new SoundComponent())
    return entity
  }
}
