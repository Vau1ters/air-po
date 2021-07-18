import { Entity } from '@core/ecs/entity'
import { dandelionAI } from '@game/ai/entity/dandelion/dandelionAI'
import { AiComponent } from '@game/components/aiComponent'
import { TileEntityFactory } from '@game/entities/tileEntityFactory'

export default class DandelionFactory extends TileEntityFactory {
  public create(): Entity {
    const entity = super.create()

    entity.addComponent('Ai', new AiComponent(dandelionAI(entity, this.world)))
    return entity
  }
}
