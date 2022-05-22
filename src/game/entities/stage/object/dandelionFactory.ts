import { Entity } from '@core/ecs/entity'
import { dandelionAI } from '@game/ai/entity/dandelion/dandelionAI'
import { AiComponent } from '@game/components/aiComponent'
import { ObjectEntityFactory } from '@game/entities/objectEntityFactory'

export default class DandelionFactory extends ObjectEntityFactory {
  public create(): Entity {
    const entity = super.create()

    entity.addComponent('Ai', new AiComponent(entity, dandelionAI(entity, this.world)))
    return entity
  }
}
