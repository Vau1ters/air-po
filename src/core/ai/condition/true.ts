import { Node, NodeState } from '../node'

export class True implements Node {
  public initState(): void {
    // 何もしない
  }

  public execute(): NodeState {
    return NodeState.Success
  }
}
