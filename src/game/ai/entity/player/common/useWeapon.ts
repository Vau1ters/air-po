import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { emitAir } from './emitAir'
import { gunShoot } from './gunShoot'

export const useWeapon = function* (entity: Entity, world: World): Behaviour<void> {
  const player = entity.getComponent('Player')
  while (true) {
    switch (player.currentWeapon) {
      case 'Gun':
        yield* gunShoot(entity, world)
        break
      case 'Emitter':
        yield* emitAir(entity)
        break
    }
  }
}
