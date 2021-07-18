import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { playerUIAI } from '@game/ai/entity/playerUI/playerUIAI'
import { AiComponent } from '@game/components/aiComponent'
import { EntityFactory } from './entityFactory'

export class PlayerUIFactory extends EntityFactory {
  public constructor(private world: World) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()
    entity.addComponent('Ai', new AiComponent(playerUIAI(this.world)))

    return entity
  }
}
