import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { playerUIAI } from '@game/ai/entity/playerUI/playerUIAI'
import { AIComponent } from '@game/components/aiComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { Graphics } from 'pixi.js'
import { EntityFactory } from './entityFactory'

export class PlayerUIFactory extends EntityFactory {
  public constructor(private world: World) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()

    const hpGauge = new Graphics()
    hpGauge.position.set(0, 0)

    const airGauge: Graphics = new Graphics()
    airGauge.position.set(6, 20)

    const ui = new DrawComponent({ entity, type: 'UI' })
    ui.addChild(hpGauge)
    ui.addChild(airGauge)

    entity.addComponent('Draw', ui)
    entity.addComponent('AI', new AIComponent(playerUIAI(entity, this.world)))
    entity.addComponent('Position', new PositionComponent())

    return entity
  }
}
