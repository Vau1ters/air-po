import { Behaviour } from '@core/behaviour/behaviour'
import { wait } from '@core/behaviour/wait'
import { FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { TitleWorldFactory } from '@game/worlds/titleWorldFactory'
import { isPlayerAlive } from '../common/condition/isPlayerAlive'

export const gameWorldAI = function*(world: World): Behaviour<World> {
  const playerFamily = new FamilyBuilder(world).include('Player').build()
  const condition = isPlayerAlive(playerFamily)

  while (condition()) {
    yield
  }
  yield* wait(60)
  return new TitleWorldFactory().create()
}
