import { Node, NodeState } from '../node'

export class TrueNode implements Node {
  public initState(): void {
    // 何もしない
  }

  public execute(): NodeState {
    return NodeState.Success
  }
}
