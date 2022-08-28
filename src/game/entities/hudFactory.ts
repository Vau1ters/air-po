import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { hudPlayerAI } from '@game/ai/entity/hud/hudPlayerAI'
import { AiComponent } from '@game/components/aiComponent'
import { EntityFactory } from './entityFactory'

export class HudFactory extends EntityFactory {
  public constructor(private world: World) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()
    entity.addComponent('Ai', new AiComponent(entity, hudPlayerAI(this.world)))

    return entity
  }
}
