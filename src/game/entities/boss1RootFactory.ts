import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { rootAI } from '@game/ai/entity/boss1/rootAI'
import { AiComponent } from '@game/components/aiComponent'
import { AttackComponent } from '@game/components/attackComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { EntityFactory } from './entityFactory'
import { loadEntity } from './loader/EntityLoader'

export class Boss1RootFactory extends EntityFactory {
  constructor(private pos: Vec2, private world: World) {
    super()
  }

  public create(): Entity {
    const entity = loadEntity('boss1Root')

    const draw = entity.getComponent('Draw')
    draw.zIndex = -2

    entity.addComponent('Attack', new AttackComponent(1, false))
    entity.addComponent('Ai', new AiComponent(rootAI(entity, this.world)))
    entity.addComponent('Position', new PositionComponent(this.pos.x, this.pos.y + draw.height / 2))
    return entity
  }
}
