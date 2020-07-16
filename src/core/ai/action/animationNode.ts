import { BehaviourNode, ExecuteResult } from '../behaviour'
import { Entity } from '../../ecs/entity'

export class AnimationNode extends BehaviourNode {
  private entity: Entity
  private animationName: string

  public constructor(entity: Entity, animationName: string) {
    super()
    this.entity = entity
    this.animationName = animationName
  }

  protected async behaviour(): Promise<ExecuteResult> {
    this.entity.getComponent('AnimationState').state = this.animationName
    return 'Success'
  }
}
