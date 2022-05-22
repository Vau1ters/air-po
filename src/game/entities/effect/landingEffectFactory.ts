import { Entity } from '@core/ecs/entity'
import { EntityFactory } from '../entityFactory'
import { AiComponent } from '@game/components/aiComponent'
import { effectAI } from '@game/ai/entity/player/effect/effectAI'
import { PositionComponent } from '@game/components/positionComponent'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { assert } from '@utils/assertion'
import { loadEntity } from '../loader/EntityLoader'
import { HorizontalDirectionComponent } from '@game/components/horizontalDirectionComponent'

export class LandingEffectFactory extends EntityFactory {
  private position?: Vec2

  public constructor(private world: World, private direction: HorizontalDirectionComponent) {
    super()
  }

  public setPosition(position: Vec2): this {
    this.position = position
    return this
  }

  public create(): Entity {
    assert(this.position !== undefined, 'position is not defined')

    const entity = loadEntity('landingEffect')
    entity.addComponent('Ai', new AiComponent(entity, effectAI(entity, this.world)))
    entity.addComponent('Position', new PositionComponent(this.position.x, this.position.y))
    const direction = new HorizontalDirectionComponent(entity, this.direction.looking)
    entity.addComponent('HorizontalDirection', direction)

    return entity
  }
}
