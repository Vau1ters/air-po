import { Behaviour } from '@core/behaviour/behaviour'
import { suspendable } from '@core/behaviour/suspendable'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { getSingleton } from '@game/systems/singletonSystem'
import { airNadeLaserSightAI } from './airNadeLaserSightAI'
import { gunLaserSightAI } from './gunLaserSightAI'
import { searchLaserSightAI } from './searchLaserSightAI'

export const laserSightAI = function* (laser: Entity, world: World): Behaviour<void> {
  const player = getSingleton('Player', world)
  const behaviours = {
    Gun: (): Behaviour<void> => gunLaserSightAI(laser, world),
    AirNade: (): Behaviour<void> => airNadeLaserSightAI(laser, world),
    Search: (): Behaviour<void> => searchLaserSightAI(laser, world),
  }
  while (true) {
    const current = player.getComponent('Player').currentWeapon
    const behaviour = behaviours[current]
    yield* suspendable(
      (): boolean => player.getComponent('Player').currentWeapon === current,
      behaviour()
    )
  }
}
