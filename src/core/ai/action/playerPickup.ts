import { Behaviour } from '../behaviour'
import { Entity } from '../../ecs/entity'
import { KeyController } from '../../systems/controlSystem'

export const playerPickup = function*(entity: Entity): Behaviour<void> {
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
}
