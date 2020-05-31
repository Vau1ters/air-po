import { BehaviourNode, NodeState } from '../behaviourNode'
import { Entity } from '../../ecs/entity'

export class IsDeadNode implements BehaviourNode {
  public initState(): void {
    // 何もしない
  }

  public execute(entity: Entity): NodeState {
    const hp = entity.getComponent('HP')

    if (hp) {
      if (hp.hp <= 0) {
        return NodeState.Success
      } else {
        return NodeState.Failure
      }
    }
    return NodeState.Failure
  }
}
