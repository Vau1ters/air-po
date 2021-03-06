import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAll } from '@core/behaviour/composite'
import { wait } from '@core/behaviour/wait'
import { FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { KeyController } from '@game/systems/controlSystem'
import { GameWorldFactory } from '@game/worlds/gameWorldFactory'
import { PauseWorldFactory } from '@game/worlds/pauseWorldFactory'
import { FadeIn } from '../common/animation/fadeIn'
import { Text } from './text'
import { isPlayerAlive } from '../common/condition/isPlayerAlive'
import { Map } from '@game/map/mapBuilder'

const game = function*(world: World): Behaviour<void> {
  const playerFamily = new FamilyBuilder(world).include('Player').build()
  const isGameOn = isPlayerAlive(playerFamily)
  const shouldPause = (): boolean => KeyController.isActionPressed('Pause')
  while (isGameOn()) {
    if (shouldPause()) {
      const pauseWorld = new PauseWorldFactory().create(world)
      pauseWorld.start()
      world.pause()
    }
    yield
  }
}

export const gameWorldAI = (map: Map) =>
  function*(world: World): Behaviour<void> {
    yield* FadeIn(world)

    yield* parallelAll([game(world), Text(world, 'そうなんちてん')])

    yield* wait(60)

    const playerFamily = new FamilyBuilder(world).include('Player').build()
    const [player] = playerFamily.entityArray
    const gameWorldFactory = new GameWorldFactory()
    const gameWorld = gameWorldFactory.create(map)
    gameWorldFactory.respawnPlayer(player)
    gameWorld.start()
    return
  }
