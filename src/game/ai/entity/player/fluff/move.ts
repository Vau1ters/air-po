import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { KeyController } from '@game/systems/controlSystem'
import { assert } from '@utils/assertion'
import { PLAYER_SETTING } from '../playerAI'

export const move = function* (entity: Entity): Behaviour<void> {
  const player = entity.getComponent('Player')
  const playerPosition = entity.getComponent('Position')
  const fluff = player.possessingEntity
  assert(fluff !== undefined, 'fluff is not possessed')
  const fluffPosition = fluff.getComponent('Position')

  while (true) {
    const pos = fluffPosition.add(PLAYER_SETTING.fluff.chase.grabPosition)
    const diff = pos.sub(playerPosition)
    if (diff.x < PLAYER_SETTING.fluff.move.speed && KeyController.isActionPressing('MoveRight')) {
      fluffPosition.x += PLAYER_SETTING.fluff.move.speed
    } else if (
      diff.x > -PLAYER_SETTING.fluff.move.speed &&
      KeyController.isActionPressing('MoveLeft')
    ) {
      fluffPosition.x -= PLAYER_SETTING.fluff.move.speed
    }
    yield
  }
}
