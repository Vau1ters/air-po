import { EntityFactory } from './entityFactory'
import { Entity } from '../ecs/entity'
import { PositionComponent } from '../components/positionComponent'
import { DrawComponent } from '../components/drawComponent'
import { AIComponent } from '../components/aiComponent'
import { parseSprite } from '../parser/spriteParser'
import { AnimationStateComponent } from '../components/animationStateComponent'
import dandelionDefinition from '../../../res/entities/dandelion.json'
import { World } from '../ecs/world'
import { dandelionAI } from '../ai/dandelionAI'

export class DandelionFactory extends EntityFactory {
  constructor(private world: World) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()
    const position = new PositionComponent(0, 0)
    const draw = new DrawComponent()

    const sprite = parseSprite(dandelionDefinition.sprite)

    draw.addChild(sprite)

    const animState = new AnimationStateComponent()
    animState.changeState.addObserver(x => sprite.changeTo(x))

    const ai = new AIComponent(dandelionAI(entity, this.world))

    entity.addComponent('AI', ai)
    entity.addComponent('Position', position)
    entity.addComponent('Draw', draw)
    entity.addComponent('AnimationState', animState)
    return entity
  }
}
