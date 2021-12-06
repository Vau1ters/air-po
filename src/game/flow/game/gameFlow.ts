import { parallelAll } from '@core/behaviour/composite'
import { wait } from '@core/behaviour/wait'
import { KeyController } from '@game/systems/controlSystem'
import { FadeIn } from '../common/animation/fadeIn'
import { Text } from './text'
import { suspendable } from '@core/behaviour/suspendable'
import { pauseFlow } from '../pause/pauseFlow'
import { Flow } from '../flow'
import { getSingleton } from '@game/systems/singletonSystem'
import { assert } from '@utils/assertion'
import { branch, BranchController } from '@core/behaviour/branch'
import { Behaviour } from '@core/behaviour/behaviour'
import { inventoryFlow } from '../inventory/inventoryFlow'
import { loadData } from '@game/playdata/playdata'
import { GameWorldFactory } from './gameWorldFactory'
import { shopFlow } from '../shop/shopFlow'
import { loadStage, StageInfo } from '@game/stage/stageLoader'

export const gameFlow = function* (stageInfo: StageInfo): Flow {
  const gameWorldFactory = new GameWorldFactory()
  const world = gameWorldFactory.create()
  loadStage(world, stageInfo)

  const gameEvent = getSingleton('GameEvent', world).getComponent('GameEvent')
  const isGameOn = (): boolean => gameEvent.event === undefined

  yield* branch({
    Game: function* (controller: BranchController) {
      const transitState = function* (): Behaviour<void> {
        while (true) {
          if (KeyController.isActionPressed('Pause')) {
            controller.transit('Pause')
          }
          if (KeyController.isActionPressed('Inventory')) {
            controller.transit('Inventory')
          }
          if (KeyController.isActionPressed('Shop')) {
            controller.transit('Shop')
          }
          yield
        }
      }
      const postEffect = function* (): Generator<void> {
        yield* FadeIn(world)
        yield* Text(world, 'そうなんちてん')
      }
      yield* suspendable(isGameOn, parallelAll([transitState(), postEffect(), world.execute()]))
      controller.finish()
    },
    Pause: function* (controller: BranchController) {
      while (true) {
        yield* pauseFlow()
        controller.transit('Game')
        yield
      }
    },
    Inventory: function* (controller: BranchController) {
      while (true) {
        yield* inventoryFlow(world)
        controller.transit('Game')
        yield
      }
    },
    Shop: function* (controller: BranchController) {
      while (true) {
        yield* shopFlow(world)
        controller.transit('Game')
        yield
      }
    },
  }).start('Game')
  yield* wait.frame(60)
  world.end()

  assert(gameEvent.event !== undefined, '')

  switch (gameEvent.event.type) {
    case 'move': {
      const player = getSingleton('Player', world)
      return gameFlow({
        ...stageInfo,
        spawnPoint: gameEvent.event.spawnPoint,
        playerData: player.getComponent('Player').playerData,
      })
    }
    case 'playerDie': {
      return gameFlow({ ...stageInfo, ...loadData() })
    }
  }
}
