import { BehaviourNode, NodeState } from '../behaviourNode'

export class TrueNode implements BehaviourNode {
  public initState(): void {
    // 何もしない
  }

  public execute(): NodeState {
    return NodeState.Success
  }
}

export class FalseNode implements BehaviourNode {
  public initState(): void {
    // 何もしない
  }

  public execute(): NodeState {
    return NodeState.Failure
  }
}
