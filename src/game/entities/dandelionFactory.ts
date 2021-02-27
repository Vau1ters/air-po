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
    const position = new PositionComponent()

    const sprite = parseAnimation(dandelionDefinition.sprite)
    const draw = new DrawComponent(entity)
    draw.addChild(sprite)

    const animState = new AnimationStateComponent(sprite)

    const ai = new AIComponent(dandelionAI(entity, this.world))

    entity.addComponent('AI', ai)
    entity.addComponent('Position', position)
    entity.addComponent('Draw', draw)
    entity.addComponent('AnimationState', animState)
    return entity
  }
}
