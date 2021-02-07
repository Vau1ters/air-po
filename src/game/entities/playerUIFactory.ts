import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { playerUIAI } from '@game/ai/entity/playerUI/playerUIAI'
import { AIComponent } from '@game/components/aiComponent'
import { UIComponent } from '@game/components/uiComponent'
import PhysicsSystem from '@game/systems/physicsSystem'
import { Graphics } from 'pixi.js'
import { EntityFactory } from './entityFactory'

export class PlayerUIFactory extends EntityFactory {
  public constructor(private world: World, private physicsSystem: PhysicsSystem) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()

    const hpGauge = new Graphics()
    hpGauge.position.set(0, 0)

    const airGauge: Graphics = new Graphics()
    airGauge.position.set(6, 20)

    const laserSight = new Graphics()
    laserSight.position.set(0)

    const ui = new UIComponent()
    ui.addChild(hpGauge)
    ui.addChild(airGauge)
    ui.addChild(laserSight)

    entity.addComponent('UI', ui)
    entity.addComponent('AI', new AIComponent(playerUIAI(entity, this.world, this.physicsSystem)))

    return entity
  }
}
