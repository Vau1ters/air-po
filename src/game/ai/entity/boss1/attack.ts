import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { root } from './root'
import { shot } from './shot'
import { StemState } from './stem'
import { wait } from './wait'

const selectNext = (state: StemState, boss: Entity, world: World): Behaviour<void> => {
  const r = Math.random()
  if (r < 1) {
    return root(state, boss, world)
  } else {
    return shot(state, boss, world)
  }
}

export const attack = function*(state: StemState, boss: Entity, world: World): Behaviour<void> {
  while (true) {
    yield* wait(state)
    yield* selectNext(state, boss, world)
  }
}
