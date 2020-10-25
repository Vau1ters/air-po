import { Entity } from '../../../ecs/entity'
import { World } from '../../../ecs/world'
import { Behaviour } from '../../behaviour'
import { suspendable } from '../../suspendable'
import { isAlive } from '../common/condition/isAlive'
import { parallel } from '../../composite'
import { playerGunShoot } from './playerGunShoot'
import { playerMove } from './playerMove'
import { playerJet } from './playerJet'
import { playerPickup } from './playerPickup'
import { playerItemAction } from './playerItemAction'
import { invincibleTime } from '../common/action/invincibleTime'
import { animate } from '../common/action/animate'
import { wait } from '../../wait'

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
