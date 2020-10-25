import { World } from '@core/ecs/world'
import { Behaviour } from '@core/behaviour/behaviour'
import { FamilyBuilder } from '@core/ecs/family'
import { assert } from '@utils/assertion'
import { isAlive } from '../entity/common/condition/isAlive'
import { wait } from '@core/behaviour/wait'
import { TitleWorldFactory } from '@game/worlds/titleWorldFactory'

export const gameWorldAI = function*(world: World): Behaviour<World> {
  const playerFamily = new FamilyBuilder(world).include('Player').build()
  assert(playerFamily.entityArray.length === 1)
  const playerEntity = playerFamily.entityArray[0]
  const isPlayerAlive = isAlive(playerEntity)

  while (isPlayerAlive()) {
    yield
  }
  yield* wait(60)

  return new TitleWorldFactory().create()
}
