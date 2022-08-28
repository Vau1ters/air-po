import { Entity } from '@core/ecs/entity'
import { bgmAI } from '@game/ai/entity/bgm/bgmAI'
import { AiComponent } from '@game/components/aiComponent'
import { BgmComponent } from '@game/components/bgmComponent'
import { EntityFactory } from './entityFactory'

export class BgmFactory extends EntityFactory {
  public create(): Entity {
    const entity = new Entity()
    entity.addComponent('Bgm', new BgmComponent())
    entity.addComponent('Ai', new AiComponent(entity, bgmAI(entity)))
    return entity
  }
}
