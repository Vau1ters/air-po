import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { DrawComponent } from '@game/components/drawComponent'
import { down } from './down'
import { shot } from './shot'
import { StemState } from './stem'
import { wait } from './wait'

export const attack = function*(state: StemState, boss: Entity, world: World): Behaviour<void> {
  while (true) {
    yield* wait(state)
    yield* down(state, world)
    // yield* shot(state, boss, world)
  }
}
