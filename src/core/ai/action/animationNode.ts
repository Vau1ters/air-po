import { BehaviourNode, Behaviour } from '../behaviourNode'
import { Entity } from '../../ecs/entity'

export class AnimationNode extends BehaviourNode {
  private entity: Entity
  private animationName: string

  public constructor(entity: Entity, animationName: string) {
    super()
    this.entity = entity
    this.animationName = animationName
  }

  protected *behaviour(): Behaviour {
    this.entity.getComponent('AnimationState').state = this.animationName
    yield
    return 'Success'
  }
}
