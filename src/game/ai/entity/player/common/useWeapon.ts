import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { shotGun } from './shotGun'
import { throwAirNade } from './throwAirNade'

export const useWeapon = function*(entity: Entity, world: World): Behaviour<void> {
  const player = entity.getComponent('Player')
  while (true) {
    switch (player.currentWeapon) {
      case 'Gun':
        yield* shotGun(entity, world)
        break
      case 'AirNade':
        yield* throwAirNade(entity, world)
        break
    }
  }
}
