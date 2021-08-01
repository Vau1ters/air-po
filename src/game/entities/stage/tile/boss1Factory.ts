import { Entity } from '@core/ecs/entity'
import { boss1AI } from '@game/ai/entity/boss1/boss1AI'
import { AiComponent } from '@game/components/aiComponent'
import { HpComponent } from '@game/components/hpComponent'
import { InvincibleComponent } from '@game/components/invincibleComponent'
import { TileEntityFactory } from '@game/entities/tileEntityFactory'

export default class Boss1Factory extends TileEntityFactory {
  public create(): Entity {
    const entity = super.create()
    entity.addComponent('Ai', new AiComponent(boss1AI(entity, this.world)))
    entity.addComponent('Invincible', new InvincibleComponent())
    entity.addComponent('Hp', new HpComponent(10, 10))
    return entity
  }
}
