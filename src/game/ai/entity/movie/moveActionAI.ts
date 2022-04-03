import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAny } from '@core/behaviour/composite'
import { ease } from '@core/behaviour/easing/easing'
import { Out } from '@core/behaviour/easing/functions'
import { Entity } from '@core/ecs/entity'
import { Family } from '@core/ecs/family'
import { Vec2 } from '@core/math/vec2'
import { MoveAction } from '@game/movie/movie'
import { animate } from '../common/action/animate'
import { findActor, resolvePosition } from './util'

const walkTo = function* (actor: Entity, speed: number, arrival: Vec2): Behaviour<void> {
  const pos = actor.getComponent('Position')
  if (pos.x < arrival.x) {
    while (pos.x < arrival.x) {
      pos.x += speed
      yield
    }
    pos.x = arrival.x
    return
  }
  if (pos.x > arrival.x) {
    while (pos.x > arrival.x) {
      pos.x -= speed
      yield
    }
    pos.x = arrival.x
    return
  }
}

export const moveActionAI = function* (action: MoveAction, nameFamily: Family): Behaviour<void> {
  const actor = findActor(action.mover, nameFamily)
  const pos = actor.getComponent('Position')
  const start = pos.copy()
  const end = resolvePosition(action.to, nameFamily)

  switch (action.type) {
    case 'walk':
      yield* parallelAny([
        animate({
          entity: actor,
          state: 'Walking',
          loopCount: Infinity,
        }),
        walkTo(actor, 1, end),
      ]),
        yield* animate({
          entity: actor,
          state: 'Standing',
          loopCount: 1,
        })
      break
    case 'warp':
      pos.assign(end)
      break
    case 'ease':
      yield* ease(Out.quad)(50, (value: number): void => {
        pos.assign(Vec2.mix(start, end, value))
      })
      break
  }
}
