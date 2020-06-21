import { BehaviourNode, NodeState } from '../behaviourNode'
import { Entity } from '../../ecs/entity'

export class AnimationNode implements BehaviourNode {
  public constructor(private animationName: string) {}

  public initState(): void {
    // 何もしない
  }

  public execute(entity: Entity): NodeState {
    entity.getComponent('AnimationState').state = this.animationName
    return NodeState.Success
  }
}
