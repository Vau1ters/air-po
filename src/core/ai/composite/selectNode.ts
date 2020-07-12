import { Entity } from '../../ecs/entity'
import { World } from '../../ecs/world'
import { BehaviourNode, NodeState } from '../behaviourNode'

export class SelectNode implements BehaviourNode {
  private executingNodes: Array<BehaviourNode> = []

  public constructor(protected children: Array<BehaviourNode> = []) {
    this.initState()
  }

  public addChild(node: BehaviourNode): void {
    this.children.push(node)
    this.executingNodes.push(node)
  }

  public initState(): void {
    this.children.forEach(node => node.initState())
    this.executingNodes = this.children.concat()
  }

  public execute(entity: Entity, world: World): NodeState {
    if (this.children.length === 0) return NodeState.Failure
    if (this.executingNodes.length === 0) {
      throw new Error('call already failed select node.')
    }

    let state = this.executingNodes[0].execute(entity, world)
    while (state === NodeState.Failure) {
      this.executingNodes.shift()
      if (this.executingNodes.length === 0) {
        return NodeState.Failure
      }

      state = this.executingNodes[0].execute(entity, world)
    }
    return state
  }
}
