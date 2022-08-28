import { Entity } from '@core/ecs/entity'
import { boss1AI } from '@game/ai/entity/boss1/boss1AI'
import { AiComponent } from '@game/components/aiComponent'
import { InvincibleComponent } from '@game/components/invincibleComponent'
import { ObjectEntityFactory } from '@game/entities/objectEntityFactory'

export default class Boss1Factory extends ObjectEntityFactory {
  public create(): Entity {
    const entity = super.create()
    entity.addComponent('Ai', new AiComponent(entity, boss1AI(entity, this.world)))
    entity.addComponent('Invincible', new InvincibleComponent())
    return entity
  }
}
