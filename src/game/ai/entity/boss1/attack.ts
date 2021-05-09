import { Behaviour } from '@core/behaviour/behaviour'
import { wait } from '@core/behaviour/wait'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { shot } from './shot'
import { StemState } from './stem'

export const attack = function*(state: StemState, boss: Entity, world: World): Behaviour<void> {
  while (true) {
    yield* wait(60)
    yield* shot(state, boss, world)
  }
}
