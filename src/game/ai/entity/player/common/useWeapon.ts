import { Behaviour } from '@core/behaviour/behaviour'
import { branch } from '@core/behaviour/branch'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { search } from './search'
import { shootGun } from './shootGun'
import { throwAirNade } from './throwAirNade'

export const useWeapon = function* (entity: Entity, world: World): Behaviour<void> {
  const player = entity.getComponent('Player')

  yield* branch({
    Gun: (): Behaviour<void> => shootGun(entity, world),
    AirNade: (): Behaviour<void> => throwAirNade(entity, world),
    Search: (): Behaviour<void> => search(entity, world),
  }).by(() => player.currentWeapon)
}
