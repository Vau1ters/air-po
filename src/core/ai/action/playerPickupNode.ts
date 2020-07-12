import { BehaviourNode, NodeState } from '../behaviourNode'
import { Entity } from '../../ecs/entity'
import { KeyController } from '../../systems/controlSystem'

export class PlayerPickupNode implements BehaviourNode {
  public initState(): void {
    // 何もしない
  }
  public execute(entity: Entity): NodeState {
    const player = entity.getComponent('Player')

    if (KeyController.isKeyPressed('E')) {
      if (player.possessingEntity !== null) {
        const target = player.possessingEntity.getComponent('PickupTarget')
        target.isPossessed = false
        player.possessingEntity = null
      } else if (player.pickupTarget !== null) {
        const target = player.pickupTarget.getComponent('PickupTarget')
        target.isPossessed = true
        player.possessingEntity = player.pickupTarget
      }
    }
    player.pickupTarget = null
    return NodeState.Success
  }
}
