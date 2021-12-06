import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { KeyController } from '@game/systems/controlSystem'

export const release = function* (entity: Entity): Behaviour<void> {
  const player = entity.getComponent('Player')

  while (true) {
    if (KeyController.isKeyPressed('E')) {
      if (player.possessingEntity !== undefined) {
        const target = player.possessingEntity.getComponent('PickupTarget')
        target.isPossessed = false
        player.possessingEntity = undefined
      }
    }
    yield
  }
}
