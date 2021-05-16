import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { playerUIAI } from '@game/ai/entity/playerUI/playerUIAI'
import { AIComponent } from '@game/components/aiComponent'
import { EntityFactory } from './entityFactory'

export class PlayerUIFactory extends EntityFactory {
  public constructor(private world: World) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()
    entity.addComponent('AI', new AIComponent(playerUIAI(this.world)))

    return entity
  }
}
