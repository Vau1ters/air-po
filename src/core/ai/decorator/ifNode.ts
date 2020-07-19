import { BehaviourNode, Behaviour } from '../behaviourNode'

export class IfNode extends BehaviourNode {
  public constructor(
    private condNode: BehaviourNode,
    private thenNode: BehaviourNode,
    private elseNode?: BehaviourNode
  ) {
    super()
  }

  protected *behaviour(): Behaviour {
    const cond = yield* this.condNode.iterator
    if (cond === 'Success') {
      return yield* this.thenNode.iterator
    } else if (this.elseNode) {
      return yield* this.elseNode.iterator
    }
    return 'Failure'
  }
}
