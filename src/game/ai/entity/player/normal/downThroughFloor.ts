import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { KeyController } from '@game/systems/controlSystem'
import { PLAYER_SETTING } from '../playerAI'

export const downThroughFloor = function* (entity: Entity): Behaviour<void> {
  const player = entity.getComponent('Player')

  while (true) {
    if (player.landing && KeyController.isActionPressing('MoveDown')) {
      player.throughFloorIgnoreCount = PLAYER_SETTING.normal.throughFloor.ignoreCount
    }
    if (player.throughFloorIgnoreCount > 0) {
      player.throughFloorIgnoreCount--
    }
    yield
  }
}
