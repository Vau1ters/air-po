import { Entity } from '../../ecs/entity'
import { World } from '../../ecs/world'
import { Node, NodeState } from '../node'

export class ParallelNode extends Node {
  private executing: Array<Node> = []

  public addChild(node: Node): void {
    this.children.push(node)
  }

  public constructor(protected children: Array<Node> = []) {
    super()
    this.initState()
  }

  public initState(): void {
    this.executing = this.children.concat()
    this.children.forEach(node => node.initState())
  }
  // 全部Successになるかどれか一つがFailureになったら終了
  public execute(entity: Entity, world: World): NodeState {
    const nextExecuting = new Array<Node>()
    for (const child of this.children) {
      switch (child.execute(entity, world)) {
        case NodeState.Success:
          break
        case NodeState.Failure:
          return NodeState.Failure
        case NodeState.Running:
          nextExecuting.push(child)
          break
      }
    }
    this.executing = nextExecuting
    if (this.executing.length === 0) return NodeState.Success
    return NodeState.Running
  }
}
