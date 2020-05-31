import { BehaviourNode, NodeState } from '../behaviourNode'

export class WaitNode implements BehaviourNode {
  private currentTime = 0
  public constructor(private time: number) {}

  public initState(): void {
    this.currentTime = 0
  }

  public execute(): NodeState {
    if (this.currentTime >= this.time) {
      return NodeState.Success
    }
    this.currentTime++
    return NodeState.Running
  }
}
