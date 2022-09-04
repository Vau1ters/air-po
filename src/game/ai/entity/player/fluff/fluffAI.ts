import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAll } from '@core/behaviour/composite'
import { suspendable } from '@core/behaviour/suspendable'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { assert } from '@utils/assertion'
import { release } from './release'
import { PLAYER_SETTING } from '../playerAI'
import { chase } from './chase'
import { move } from './move'
import { useWeapon } from '../common/useWeapon'
import { switchWeapon } from '../common/switchWeapon'

export const fluffAI = function* (entity: Entity, world: World): Behaviour<void> {
  const player = entity.getComponent('Player')
  const playerBody = entity.getComponent('RigidBody')
  const playerPosition = entity.getComponent('Position')
  const fluff = player.possessingEntity
  assert(fluff !== undefined, 'fluff is not possessed')
  const fluffPosition = fluff.getComponent('Position')

  playerBody.gravityScale = 0
  playerBody.velocity.x = 0
  playerBody.velocity.y = 0
  yield* suspendable(
    () =>
      playerPosition.sub(fluffPosition.add(PLAYER_SETTING.fluff.chase.grabPosition)).length() <
      PLAYER_SETTING.fluff.release.distance,
    parallelAll([
      chase(entity),
      move(entity),
      release(entity),
      useWeapon(entity, world),
      switchWeapon(entity),
    ])
  )
  player.possessingEntity = undefined
}
