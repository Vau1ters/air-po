import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { hudAI } from '@game/ai/entity/hud/hudAI'
import { AiComponent } from '@game/components/aiComponent'
import { EntityFactory } from './entityFactory'

export class UIFactory extends EntityFactory {
  public constructor(private world: World) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()
    entity.addComponent('Ai', new AiComponent(hudAI(this.world)))

    return entity
  }
}
