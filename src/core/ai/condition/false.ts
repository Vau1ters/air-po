import { Node, NodeState } from '../node'

export class False implements Node {
  public initState(): void {
    // 何もしない
  }

  public execute(): NodeState {
    return NodeState.Failure
  }
}
