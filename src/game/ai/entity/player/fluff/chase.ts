import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { assert } from '@utils/assertion'
import { PLAYER_SETTING } from '../playerAI'

export const chase = function*(entity: Entity): Behaviour<void> {
  const player = entity.getComponent('Player')
  const playerPosition = entity.getComponent('Position')
  const fluff = player.possessingEntity
  assert(fluff !== undefined, 'fluff is not possessed')
  const fluffPosition = fluff.getComponent('Position')

  while (true) {
    const pos = fluffPosition.add(PLAYER_SETTING.fluff.chase.grubPosition)
    playerPosition.x += (pos.x - playerPosition.x) * PLAYER_SETTING.fluff.chase.chaseScale
    playerPosition.y += (pos.y - playerPosition.y) * PLAYER_SETTING.fluff.chase.chaseScale
    yield
  }
}
