import { EntityFactory } from './entityFactory'
import { Entity } from '../entity'
import { PositionComponent } from '../components/positionComponent'
import { DrawComponent } from '../components/drawComponent'
import { AIComponent } from '../components/aiComponent'
import { parseAnimation } from '../../graphics/animationParser'
import { AnimationStateComponent } from '../components/animationStateComponent'
import dandelionDefinition from '../../../res/animation/dandelion.json'
import { World } from '../world'
import { dandelionAI } from '../../behaviour/entityAI/dandelion/dandelionAI'

export class DandelionFactory extends EntityFactory {
  constructor(private world: World) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()
    const position = new PositionComponent(0, 0)

    const sprite = parseAnimation(dandelionDefinition.sprite)
    const draw = new DrawComponent(entity, sprite)

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
