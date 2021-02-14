import { Behaviour } from '@core/behaviour/behaviour'
import { wait } from '@core/behaviour/wait'
import { FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { KeyController } from '@game/systems/controlSystem'
import { PauseWorldFactory } from '@game/worlds/pauseWorldFactory'
import { TitleWorldFactory } from '@game/worlds/titleWorldFactory'
import { isPlayerAlive } from '../common/condition/isPlayerAlive'

export const gameWorldAI = function*(world: World): Behaviour<void> {
  const playerFamily = new FamilyBuilder(world).include('Player').build()
  const title = (): boolean => isPlayerAlive(playerFamily)() === false
  const pause = (): boolean => KeyController.isActionPressed('Pause')

  while (true) {
    if (title()) {
      yield* wait(60)
      const titleWorld = new TitleWorldFactory().create()
      titleWorld.start()
      return
    } else if (pause()) {
      const pauseWorld = new PauseWorldFactory().create(world)
      pauseWorld.start()
      world.pause()
    }
    yield
  }
}
