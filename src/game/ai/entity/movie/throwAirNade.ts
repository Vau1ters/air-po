import { Behaviour } from '@core/behaviour/behaviour'
import { wait } from '@core/behaviour/wait'
import { Family } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { AirNadeFactory } from '@game/entities/airNadeFactory'
import { ThrowAirNadeAction } from '@game/movie/movie'
import { findActor, resolvePosition } from './util'

export const throwAirNadeAI = function* (
  action: ThrowAirNadeAction,
  world: World,
  nameFamily: Family
): Behaviour<void> {
  const thrower = findActor(action.thrower, nameFamily)
  const targetPos = resolvePosition(action.to, nameFamily)
  const airNade = new AirNadeFactory(thrower, world, targetPos).create()
  world.addEntity(airNade)
  yield* wait.until((): boolean => !airNade.getComponent('Ai').isAlive)
}
