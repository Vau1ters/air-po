import { BehaviourNode, Behaviour } from '../behaviourNode'

export class WhileNode extends BehaviourNode {
  public constructor(private condNode: BehaviourNode, private execNode: BehaviourNode) {
    super()
  }

  protected *behaviour(): Behaviour {
    while (this.condNode.currentState === 'Running') {
      yield* this.execNode.iterator
      this.condNode.execute()
    }
    return 'Success'
  }
}
