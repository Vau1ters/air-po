import { Entity } from '@core/ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '@game/components/positionComponent'
import { loadEntity } from './loader/EntityLoader'
import { airNadeAI } from '@game/ai/entity/airNade/airNadeAI'
import { World } from '@core/ecs/world'
import { AiComponent } from '@game/components/aiComponent'

export class AirNadeFactory extends EntityFactory {
  constructor(public player: Entity, public world: World) {
    super()
  }

  public create(): Entity {
    const entity = loadEntity('airNade')
    entity.addComponent('Position', new PositionComponent())
    entity.addComponent('Ai', new AiComponent(airNadeAI(entity, this.player, this.world)))

    return entity
  }
}
