import { Entity } from '../../ecs/entity'
import { World } from '../../ecs/world'
import { BehaviourNode, NodeState } from '../behaviourNode'

export class ParallelNode implements BehaviourNode {
  private executingNodes: Array<BehaviourNode> = []

  public addChild(node: BehaviourNode): void {
    this.children.push(node)
  }

  public constructor(protected children: Array<BehaviourNode> = []) {
    this.initState()
  }

  public initState(): void {
    this.executingNodes = this.children.concat()
    this.children.forEach(node => node.initState())
  }
  // 全部Successになるかどれか一つがFailureになったら終了
  public execute(entity: Entity, world: World): NodeState {
    const nextExecutingNodes = new Array<BehaviourNode>()
    for (const child of this.children) {
      switch (child.execute(entity, world)) {
        case NodeState.Success:
          break
        case NodeState.Failure:
          return NodeState.Failure
        case NodeState.Running:
          nextExecutingNodes.push(child)
          break
      }
    }
    this.executingNodes = nextExecutingNodes
    if (this.executingNodes.length === 0) return NodeState.Success
    return NodeState.Running
  }
}
