import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { geyserAI } from '@game/ai/entity/boss1/geyserAI'
import { AiComponent } from '@game/components/aiComponent'
import { EntityFactory } from './entityFactory'
import { loadEntity } from './loader/EntityLoader'

export class Boss1GeyserFactory extends EntityFactory {
  constructor(private pos: Vec2, private world: World) {
    super()
  }

  public create(): Entity {
    const entity = loadEntity('boss1Geyser')

    entity.addComponent('Ai', new AiComponent(geyserAI(entity, this.world)))
    entity.addComponent('Position', this.pos)
    return entity
  }
}
