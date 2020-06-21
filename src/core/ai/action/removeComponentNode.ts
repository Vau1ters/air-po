import { BehaviourNode, NodeState } from '../behaviourNode'
import { Entity } from '../../ecs/entity'
import { ComponentName } from '../../ecs/component'

export class RemoveComponentNode implements BehaviourNode {
  public constructor(private removeComponent: ComponentName) {}

  public initState(): void {
    // 何もしない
  }

  public execute(entity: Entity): NodeState {
    entity.removeComponent(this.removeComponent)
    return NodeState.Success
  }
}
