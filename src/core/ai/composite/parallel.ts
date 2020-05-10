import { Entity } from '../../ecs/entity'
import { World } from '../../ecs/world'
import { Node, NodeState } from '../node'
import { Composite } from './composite'

export class Parallel extends Composite {
  private executing: Array<Node>

  public constructor(protected children: Array<Node> = []) {
    super(children)
    this.executing = this.children.concat()
  }

  public initState(): void {
    this.executing = this.children.concat()
    this.children.forEach(node => node.initState())
  }
  // 全部Successになるかどれか一つがFailureになったら終了
  public execute(entity: Entity, world: World): NodeState {
    const eliminateNode = new Array<Node>()
    for (const child of this.children) {
      switch (child.execute(entity, world)) {
        case NodeState.Success:
          eliminateNode.push(child)
          break
        case NodeState.Failure:
          return NodeState.Failure
        case NodeState.Running:
          break
      }
    }
    this.executing = this.executing.filter(
      node => ~eliminateNode.includes(node)
    )
    if (this.executing.length === 0) return NodeState.Success
    return NodeState.Running
  }
}
