import { Entity } from '@core/ecs/entity'
import { dandelionAI } from '@game/ai/entity/dandelion/dandelionAI'
import { AIComponent } from '@game/components/aiComponent'
import { MapObjectFactory } from './mapObjectFactory'

export class DandelionFactory extends MapObjectFactory {
  public create(): Entity {
    const entity = super.create()

    entity.addComponent('AI', new AIComponent(dandelionAI(entity, this.world)))
    return entity
  }
}
