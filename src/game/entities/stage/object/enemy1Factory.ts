import { Entity } from '@core/ecs/entity'
import { enemy1AI } from '@game/ai/entity/enemy1/enemy1AI'
import { AiComponent } from '@game/components/aiComponent'
import { ObjectEntityFactory } from '@game/entities/objectEntityFactory'

export default class Enemy1Factory extends ObjectEntityFactory {
  public create(): Entity {
    const entity = super.create()

    entity.addComponent('Ai', new AiComponent(entity, enemy1AI(entity, this.world)))
    return entity
  }
}
