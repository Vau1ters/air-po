import { Entity } from '@core/ecs/entity'
import { EntityFactory } from '../entityFactory'
import { DrawComponent } from '@game/components/drawComponent'
import { AIComponent } from '@game/components/aiComponent'
import { parseAnimation } from '@core/graphics/animationParser'
import sporeEffectDefinition from '@res/setting/spore.json'
import { SporeEffectAI } from '@game/ai/entity/spore/sporeEffectAI'
import { PositionComponent } from '@game/components/positionComponent'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { AnimationStateComponent } from '@game/components/animationStateComponent'

export class SporeEffectFactory extends EntityFactory {
  private position?: Vec2

  public constructor(private world: World) {
    super()
  }

  public setPosition(position: Vec2): void {
    this.position = position
  }

  public create(): Entity {
    if (!this.position) {
      console.log('mushroom is not defined')
      return new Entity()
    }

    const entity = new Entity()

    entity.addComponent(
      'Draw',
      new DrawComponent({
        entity,
        child: {
          sprite: parseAnimation(sporeEffectDefinition),
        },
      })
    )

    entity.addComponent('AnimationState', new AnimationStateComponent(entity))

    entity.addComponent('AI', new AIComponent(SporeEffectAI(entity, this.world)))

    entity.addComponent('Position', new PositionComponent(this.position.x, this.position.y))

    return entity
  }
}
