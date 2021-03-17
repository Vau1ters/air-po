import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { playerUIAI } from '@game/ai/entity/playerUI/playerUIAI'
import { AIComponent } from '@game/components/aiComponent'
import { UIComponent } from '@game/components/uiComponent'
import CollisionSystem from '@game/systems/collisionSystem'
import { Graphics } from 'pixi.js'
import { EntityFactory } from './entityFactory'

export class PlayerUIFactory extends EntityFactory {
  public constructor(private world: World, private collisionSystem: CollisionSystem) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()

    const hpGauge = new Graphics()
    hpGauge.position.set(0, 0)

    const airGauge: Graphics = new Graphics()
    airGauge.position.set(6, 20)

    const ui = new UIComponent()
    ui.addChild(hpGauge)
    ui.addChild(airGauge)

    entity.addComponent('UI', ui)
    entity.addComponent('AI', new AIComponent(playerUIAI(entity, this.world)))

    return entity
  }
}
