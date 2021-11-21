import { Entity } from '@core/ecs/entity'
import { respawnAI } from '@game/ai/entity/respawn/respawnAI'
import { AiComponent } from '@game/components/aiComponent'
import { ObjectEntityFactory } from '@game/entities/objectEntityFactory'

export default class RespawnFactory extends ObjectEntityFactory {
  public create(): Entity {
    const entity = super.create()
    entity.addComponent('Ai', new AiComponent(respawnAI(entity, this.stage)))
    return entity
  }
}
