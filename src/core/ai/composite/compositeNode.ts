import { BehaviourNode } from '../behaviourNode'

export abstract class CompositeNode extends BehaviourNode {
  protected children: Array<BehaviourNode>

  public constructor(children: Array<BehaviourNode> = []) {
    super()
    this.children = children
  }

  public initialize(): void {
    super.initialize()
    for (const node of this.children) {
      node.initialize()
    }
  }

  public addChild(...children: Array<BehaviourNode>): void {
    this.children.push(...children)
  }
}
