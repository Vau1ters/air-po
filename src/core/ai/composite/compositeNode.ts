import { BehaviourNode, ExecuteResult } from '../behaviour'

export abstract class CompositeNode extends BehaviourNode {
  protected children: Array<BehaviourNode>

  public constructor(children: Array<BehaviourNode> = []) {
    super()
    this.children = children
  }

  public addChild(...children: Array<BehaviourNode>): void {
    this.children.push(...children)
  }

  public terminate(result: ExecuteResult): void {
    super.terminate(result)
    for (const node of this.children) {
      node.terminate(result)
    }
  }
}
