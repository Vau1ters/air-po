import { BehaviourNode, NodeState } from '../behaviourNode'
import { Entity } from '../../ecs/entity'

export class IsPossessedNode implements BehaviourNode {
  public initState(): void {
    // 何もしない
  }

  public execute(entity: Entity): NodeState {
    if (entity.hasComponent('PickupTarget')) {
      const target = entity.getComponent('PickupTarget')
      if (target.isPossessed) {
        return NodeState.Success
      } else {
        return NodeState.Failure
      }
    }
    return NodeState.Failure
  }
}
