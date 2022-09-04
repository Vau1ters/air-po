import { Entity } from '@core/ecs/entity'
import { heartAI } from '@game/ai/entity/heart/heartAI'
import { AiComponent } from '@game/components/aiComponent'
import { NameComponent } from '@game/components/nameComponent'
import { ObjectEntityFactory } from '../../objectEntityFactory'

export default class heartFactory extends ObjectEntityFactory {
  public create(): Entity {
    const entity = super.create()

    entity.addComponent('Name', new NameComponent('heart'))
    entity.addComponent('Ai', new AiComponent(entity, heartAI(entity, this.world)))

    return entity
  }
}
