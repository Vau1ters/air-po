import { Entity } from '@core/ecs/entity'
import { locustAI } from '@game/ai/entity/locust/locustAI'
import { AiComponent } from '@game/components/aiComponent'
import { ObjectEntityFactory } from '@game/entities/objectEntityFactory'

export default class LocustFactory extends ObjectEntityFactory {
  public create(): Entity {
    const entity = super.create()

    entity.addComponent('Ai', new AiComponent(locustAI(entity, this.world)))
    return entity
  }
}
