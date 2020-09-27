import { Entity } from '../ecs/entity'
import { World } from '../ecs/world'
import { Behaviour } from './behaviour'
import { suspendable } from './decorator/suspendable'
import { isAlive } from './condition/isAlive'
import { parallel } from './composite/compositeBehaviour'
import { playerGunShoot } from './action/playerGunShoot'
import { playerMove } from './action/playerMove'
import { playerJet } from './action/playerJet'
import { playerPickup } from './action/playerPickup'
import { playerItemAction } from './action/playerItemAction'
import { invincibleTime } from './action/invincibleTime'
import { animate } from './action/animate'
import { wait } from './action/wait'

export const playerControl = function*(entity: Entity, world: World): Behaviour<void> {
  yield* parallel([
    playerGunShoot(entity, world),
    playerMove(entity),
    playerJet(entity),
    playerPickup(entity),
    playerItemAction(entity),
    invincibleTime(entity),
  ])
}

export const playerAI = function*(entity: Entity, world: World): Behaviour<void> {
  yield* suspendable(isAlive(entity), playerControl(entity, world))
  yield* animate(entity, 'Dying')
  yield* wait(60)
}
