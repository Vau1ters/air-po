import { BehaviourNode } from '../behaviourNode'

export abstract class CompositeNode extends BehaviourNode {
  protected children: Array<BehaviourNode>

  public constructor(children: Array<BehaviourNode> = []) {
    super()
    this.children = children
  }

  public addChild(...children: Array<BehaviourNode>): void {
    this.children.push(...children)
  }
}
