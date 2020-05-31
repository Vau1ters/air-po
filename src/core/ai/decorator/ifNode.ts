import { BehaviourNode, NodeState } from '../behaviourNode'
import { Entity } from '../../ecs/entity'
import { World } from '../../ecs/world'

export class IfNode implements BehaviourNode {
  public constructor(
    private condNode: BehaviourNode,
    private thenNode: BehaviourNode,
    private elseNode?: BehaviourNode
  ) {}

  public initState(): void {
    this.condNode.initState()
    this.thenNode.initState()
    this.elseNode?.initState()
  }

  public execute(entity: Entity, world: World): NodeState {
    switch (this.condNode.execute(entity, world)) {
      case NodeState.Running:
        return NodeState.Running
      case NodeState.Success:
        return this.thenNode.execute(entity, world)
      case NodeState.Failure:
        if (this.elseNode) {
          return this.elseNode.execute(entity, world)
        } else {
          return NodeState.Failure
        }
    }
  }
}
