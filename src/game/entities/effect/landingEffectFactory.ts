import { Entity } from '@core/ecs/entity'
import { EntityFactory } from '../entityFactory'
import { AiComponent } from '@game/components/aiComponent'
import { LandingEffectAI } from '@game/ai/entity/player/effect/landingEffectAI'
import { PositionComponent } from '@game/components/positionComponent'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { assert } from '@utils/assertion'
import { loadEntity } from '../loader/EntityLoader'

export class LandingEffectFactory extends EntityFactory {
  private position?: Vec2

  public constructor(private world: World) {
    super()
  }

  public setPosition(position: Vec2): void {
    this.position = position
  }

  public create(): Entity {
    assert(this.position !== undefined, 'mushroom is not defined')

    const entity = loadEntity('landingEffect')
    entity.addComponent('Ai', new AiComponent(LandingEffectAI(entity, this.world)))
    entity.addComponent('Position', new PositionComponent(this.position.x, this.position.y))

    return entity
  }
}
