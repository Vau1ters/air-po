import { BehaviourNode, NodeState } from '../behaviourNode'
import { World } from '../../ecs/world'
import { Entity } from '../../ecs/entity'

export class DeathNode implements BehaviourNode {
  public initState(): void {
    // 何もしない
  }

  execute(entity: Entity, world: World): NodeState {
    world.removeEntity(entity)
    return NodeState.Success
  }
}
