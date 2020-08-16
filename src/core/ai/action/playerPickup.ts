import { Behaviour } from '../behaviour'
import { Entity } from '../../ecs/entity'
import { KeyController } from '../../systems/controlSystem'

export const playerPickup = function*(entity: Entity): Behaviour<void> {
  const player = entity.getComponent('Player')

  if (KeyController.isKeyPressed('E')) {
    if (player.possessingEntity !== undefined) {
      const target = player.possessingEntity.getComponent('PickupTarget')
      target.isPossessed = false
      player.possessingEntity = undefined
    } else if (player.pickupTarget !== undefined) {
      for (const t of player.pickupTarget) {
        const target = t.getComponent('PickupTarget')
        target.isPossessed = true
        player.possessingEntity = t
      }
    }
  }
  player.pickupTarget.clear()
}
