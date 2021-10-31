import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { EntityName } from '@game/entities/loader/EntityLoader'
import { Stage } from '@game/stage/stage'
import { ObjectEntityFactory } from '@game/entities/objectEntityFactory'
import { StageObject } from '@game/stage/object'
import { AiComponent } from '@game/components/aiComponent'
import { respawnAI } from '@game/ai/entity/respawn/respawnAI'

export default class RespawnFactory extends ObjectEntityFactory {
  constructor(
    name: EntityName,
    object: StageObject,
    frame: number,
    world: World,
    private stage: Stage
  ) {
    super(name, object, frame, world)
  }

  public create(): Entity {
    const entity = super.create()
    entity.addComponent('Ai', new AiComponent(respawnAI(entity, this.stage)))
    return entity
  }
}
