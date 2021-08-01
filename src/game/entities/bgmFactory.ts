import { Entity } from '@core/ecs/entity'
import { SoundName } from '@core/sound/sound'
import { bgmAI } from '@game/ai/entity/bgm/bgmAI'
import { AiComponent } from '@game/components/aiComponent'
import { BgmComponent } from '@game/components/bgmComponent'
import { EntityFactory } from './entityFactory'

export class BgmFactory extends EntityFactory {
  constructor(private name: SoundName) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()
    entity.addComponent('Bgm', new BgmComponent())
    entity.addComponent('Ai', new AiComponent(bgmAI(entity)))

    const bgm = entity.getComponent('Bgm')
    bgm.maxVolume = 0.05
    bgm.start(this.name)
    return entity
  }
}
