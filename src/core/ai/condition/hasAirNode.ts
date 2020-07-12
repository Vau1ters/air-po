import { BehaviourNode, NodeState } from '../behaviourNode'
import { Entity } from '../../ecs/entity'

export class HasAirNode implements BehaviourNode {
  public initState(): void {
    // 何もしない
  }

  public execute(entity: Entity): NodeState {
    if (entity.hasComponent('AirHolder')) {
      const holder = entity.getComponent('AirHolder')
      if (holder.currentQuantity <= 0) {
        return NodeState.Success
      } else {
        return NodeState.Failure
      }
    }
    return NodeState.Failure
  }
}
