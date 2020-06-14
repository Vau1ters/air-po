import { BehaviourNode, NodeState } from '../behaviourNode'
import { Entity } from '../../ecs/entity'
import { World } from '../../ecs/world'

export class WhileNode implements BehaviourNode {
  public constructor(private condNode: BehaviourNode, private execNode: BehaviourNode) {}

  public initState(): void {
    this.condNode.initState()
    this.execNode.initState()
  }

  public execute(entity: Entity, world: World): NodeState {
    switch (this.condNode.execute(entity, world)) {
      case NodeState.Success:
        this.condNode.initState()
        if (this.execNode.execute(entity, world) !== NodeState.Running) {
          this.execNode.initState()
        }
        return NodeState.Running
      case NodeState.Running:
        return NodeState.Running
      case NodeState.Failure:
        return NodeState.Success
    }
  }
}
