import { Behaviour } from '../../../../core/behaviour/behaviour'
import { Entity } from '../../../../core/ecs/entity'
import { KeyController } from '@game/systems/controlSystem'

export const playerPickup = function*(entity: Entity): Behaviour<void> {
  const player = entity.getComponent('Player')

  while (true) {
    if (KeyController.isKeyPressed('E')) {
      if (player.possessingEntity !== undefined) {
        const target = player.possessingEntity.getComponent('PickupTarget')
        target.isPossessed = false
        player.possessingEntity = undefined
      } else if (player.pickupTarget.size > 0) {
        const entity = Array.from(player.pickupTarget.values())[0]
        const target = entity.getComponent('PickupTarget')
        target.isPossessed = true
        player.possessingEntity = entity
      }
    }
    player.pickupTarget.clear()
    yield
  }
}
