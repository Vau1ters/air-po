import { BehaviourNode, Behaviour } from '../behaviourNode'

export class WhileNode extends BehaviourNode {
  private condition: () => boolean
  private node: BehaviourNode

  public constructor(condition: () => boolean, node: BehaviourNode) {
    super()
    this.condition = condition
    this.node = node
  }

  protected *behaviour(): Behaviour {
    while (this.condition()) {
      this.node.execute()
      if (this.node.hasDone) {
        this.node.initialize()
      }
      yield
    }
    return 'Success'
  }
}
