import { Node, NodeState } from '../node'
import { Entity } from '../../ecs/entity'
import { World } from '../../ecs/world'

export class While implements Node {
  public constructor(private cond: Node, private child: Node) {}
  public initState(): void {
    this.cond.initState()
    this.child.initState()
  }

  public execute(entity: Entity, world: World): NodeState {
    switch (this.cond.execute(entity, world)) {
      case NodeState.Success:
        if (this.child.execute(entity, world) !== NodeState.Running) {
          this.child.initState()
        }
        return NodeState.Running
      case NodeState.Running:
        return NodeState.Running
      case NodeState.Failure:
        return NodeState.Success
    }
  }
}
