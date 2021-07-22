import { parallelAll } from '@core/behaviour/composite'
import { wait } from '@core/behaviour/wait'
import { KeyController } from '@game/systems/controlSystem'
import { GameWorldFactory } from '@game/worlds/gameWorldFactory'
import { FadeIn } from '../common/animation/fadeIn'
import { Text } from './text'
import { isPlayerAlive } from '../common/condition/isPlayerAlive'
import { loadStage, StageName } from '@game/stage/stageLoader'
import { suspendable } from '@core/behaviour/suspendable'
import { pauseFlow } from '../pause/pauseFlow'
import { Flow } from '../flow'
import { Entity } from '@core/ecs/entity'
import { getSingleton, isSingleton } from '@game/systems/singletonSystem'

export const gameFlow = function*(stageName: StageName, player?: Entity): Flow {
  const gameWorldFactory = new GameWorldFactory()
  const world = gameWorldFactory.create()
  const stage = loadStage(stageName, world)

  stage.spawnPlayer(player?.getComponent('Player').spawnerID ?? 0)

  const isGameOn = isPlayerAlive(world)
  const canExecute = (): boolean => !KeyController.isActionPressed('Pause')

  yield* suspendable(
    isGameOn,
    parallelAll([
      (function*(): Generator<void> {
        while (true) {
          yield* suspendable(canExecute, world.execute())
          yield* pauseFlow()
        }
      })(),
      (function*(): Generator<void> {
        yield* FadeIn(world)
        yield* Text(world, 'そうなんちてん')
      })(),
    ])
  )
  yield* wait(60)
  world.end()

  if (isSingleton('Bgm', world)) {
    getSingleton('Bgm', world)
      .getComponent('Bgm')
      .stop()
  }

  const nextPlayer = getSingleton('Player', world)
  return gameFlow(stageName, nextPlayer)
}
