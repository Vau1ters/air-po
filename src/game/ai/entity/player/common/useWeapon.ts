import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { shootGun } from './shootGun'
import { throwAirNade } from './throwAirNade'

export const useWeapon = function* (entity: Entity, world: World): Behaviour<void> {
  const player = entity.getComponent('Player')
  while (true) {
    switch (player.currentWeapon) {
      case 'Gun':
        yield* shootGun(entity, world)
        break
      case 'AirNade':
        yield* throwAirNade(entity, world)
        break
    }
  }
}
