import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Behaviour } from '@core/behaviour/behaviour'
import { suspendable } from '@core/behaviour/suspendable'
import { isAlive } from '../common/condition/isAlive'
import { parallelAll } from '@core/behaviour/composite'
import { playerGunShoot } from './playerGunShoot'
import { playerMove } from './playerMove'
import { playerJet } from './playerJet'
import { playerPickup } from './playerPickup'
import { playerItemAction } from './playerItemAction'
import { invincibleTime } from '../common/action/invincibleTime'
import { animate, animateLoop } from '../common/action/animate'
import { wait } from '@core/behaviour/wait'

export const playerControl = function*(entity: Entity, world: World): Behaviour<void> {
  yield* parallelAll([
    playerGunShoot(entity, world),
    playerMove(entity),
    playerJet(entity, world),
    playerPickup(entity),
    playerItemAction(entity),
    animateLoop(entity, 'Standing'),
    invincibleTime(entity),
  ])
}

export const playerAI = function*(entity: Entity, world: World): Behaviour<void> {
  yield* suspendable(isAlive(entity), playerControl(entity, world))
  yield* animate(entity, 'Dying')
  yield* wait(60)
}
