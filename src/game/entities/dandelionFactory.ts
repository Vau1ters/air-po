import { EntityFactory } from './entityFactory'
import { Entity } from '@core/ecs/entity'
import { PositionComponent } from '@game/components/positionComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { AIComponent } from '@game/components/aiComponent'
import { parseAnimation } from '@core/graphics/animationParser'
import { AnimationStateComponent } from '../components/animationStateComponent'
import dandelionDefinition from '@res/animation/dandelion.json'
import { World } from '@core/ecs/world'
import { dandelionAI } from '@game/ai/entity/dandelion/dandelionAI'

export class DandelionFactory extends EntityFactory {
  constructor(private world: World) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()

    entity.addComponent('AI', new AIComponent(dandelionAI(entity, this.world)))
    entity.addComponent('Position', new PositionComponent())
    entity.addComponent(
      'Draw',
      new DrawComponent({
        entity,
        child: {
          sprite: parseAnimation(dandelionDefinition.sprite),
        },
      })
    )
    entity.addComponent('AnimationState', new AnimationStateComponent(entity))
    return entity
  }
}
