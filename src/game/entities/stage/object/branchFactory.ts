import { Entity } from '@core/ecs/entity'
import { obstacleAI } from '@game/ai/entity/obstacle/obstacleAI'
import { AiComponent } from '@game/components/aiComponent'
import { ObjectEntityFactory } from '@game/entities/objectEntityFactory'

export default class BranchFactory extends ObjectEntityFactory {
  create(): Entity {
    const entity = super.create()
    entity.addComponent('Ai', new AiComponent(entity, obstacleAI(entity, this.world)))
    return entity
  }
}
