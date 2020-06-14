import { BehaviourNode, NodeState } from '../behaviourNode'
import { Animation } from '../../graphics/animation'

export class AnimationNode implements BehaviourNode {
  public constructor(private animation: Animation, private animationName: string) {}

  public initState(): void {
    // 何もしない
  }

  public execute(): NodeState {
    this.animation.changeTo(this.animationName)
    return NodeState.Success
  }
}
