import { BehaviourNode } from '../ai/behaviourNode'

export class AIComponent {
  private tree: BehaviourNode

  public constructor(tree: BehaviourNode) {
    this.tree = tree
  }

  public execute(): void {
    this.tree.execute()
  }
}
