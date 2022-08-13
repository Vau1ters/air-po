import { Entity } from '@core/ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '@game/components/positionComponent'
import { loadEntity } from './loader/EntityLoader'
import { airNadeAI } from '@game/ai/entity/airNade/airNadeAI'
import { World } from '@core/ecs/world'
import { AiComponent } from '@game/components/aiComponent'
import { Vec2 } from '@core/math/vec2'

export class AirNadeFactory extends EntityFactory {
  constructor(public thrower: Entity, public world: World, private targetPos: Vec2) {
    super()
  }

  public create(): Entity {
    const entity = loadEntity('airNade')
    entity.addComponent(
      'Position',
      new PositionComponent(
        this.thrower.getComponent('Position').x,
        this.thrower.getComponent('Position').y
      )
    )
    entity.addComponent(
      'Ai',
      new AiComponent(entity, airNadeAI(entity, this.thrower, this.targetPos, this.world))
    )

    return entity
  }
}
