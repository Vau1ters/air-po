import { BehaviourNode, NodeState } from '../behaviourNode'
import { Animation } from '../../graphics/animation'

export class HorizontalFlipNode implements BehaviourNode {
  private sprite: Animation

  constructor(sprite: Animation) {
    this.sprite = sprite
  }

  public initState(): void {
    // 何もしない
  }

  public execute(): NodeState {
    this.sprite.scale.x *= -1
    return NodeState.Success
  }
}
