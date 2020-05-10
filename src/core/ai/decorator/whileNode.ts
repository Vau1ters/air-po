import { BehaviourNode, NodeState } from '../behaviourNode'
import { Entity } from '../../ecs/entity'
import { World } from '../../ecs/world'

export class WhileNode implements BehaviourNode {
  public constructor(
    private arg: { cond: BehaviourNode; exec: BehaviourNode }
  ) {}
  public initState(): void {
    this.arg.cond.initState()
    this.arg.exec.initState()
  }

  public execute(entity: Entity, world: World): NodeState {
    switch (this.arg.cond.execute(entity, world)) {
      case NodeState.Success:
        if (this.arg.exec.execute(entity, world) !== NodeState.Running) {
          this.arg.exec.initState()
        }
        return NodeState.Running
      case NodeState.Running:
        return NodeState.Running
      case NodeState.Failure:
        return NodeState.Success
    }
  }
}
