import { parallelAll } from '@core/behaviour/composite'
import { wait } from '@core/behaviour/wait'
import { KeyController } from '@game/systems/controlSystem'
import { FadeIn } from '../common/animation/fadeIn'
import { Text } from './text'
import { pauseFlow } from '../pause/pauseFlow'
import { Flow } from '../flow'
import { getSingleton } from '@game/systems/singletonSystem'
import { branch, BranchController } from '@core/behaviour/branch'
import { Behaviour } from '@core/behaviour/behaviour'
import { inventoryFlow } from '../inventory/inventoryFlow'
import { loadData } from '@game/playdata/playdata'
import { GameWorldFactory } from './gameWorldFactory'
import { shopFlow } from '../shop/shopFlow'
import { loadStage, StageInfo } from '@game/stage/stageLoader'
import { World } from '@core/ecs/world'
import { movieFlow } from '../movie/movieFlow'
import { Movie } from '@game/movie/movie'

const transitState = function* (controller: BranchController<Flow>): Behaviour<void> {
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

const postEffect = function* (world: World): Generator<void> {
  yield* FadeIn(world)
  yield* Text(world, 'そうなんちてん')
}

const handleEvent = function* (
  world: World,
  stageInfo: StageInfo,
  controller: BranchController<Flow>
): Behaviour<void> {
  while (true) {
    const gameEvent = getSingleton('GameEvent', world).getComponent('GameEvent')
    const event = yield* wait.untilDefined(gameEvent, 'event')
    gameEvent.event = undefined

    switch (event.type) {
      case 'move': {
        const player = getSingleton('Player', world)
        controller.finish(
          gameFlow({
            ...stageInfo,
            spawnPoint: event.spawnPoint,
            playerData: player.getComponent('Player').playerData,
          })
        )
        return
      }
      case 'movie':
        controller.transit('Movie', [event.movie])
        break
      case 'playerDie':
        controller.finish(gameFlow({ ...stageInfo, ...loadData() }))
        return
    }

    gameEvent.event = undefined
  }
}

export const gameFlow = function* (stageInfo: StageInfo): Flow {
  const gameWorldFactory = new GameWorldFactory()
  const world = gameWorldFactory.create()
  loadStage(world, stageInfo)

  const next = yield* branch({
    Game: function* (controller: BranchController<Flow>) {
      yield* parallelAll([
        transitState(controller),
        postEffect(world),
        handleEvent(world, stageInfo, controller),
        world.execute(),
      ])
    },
    Pause: function* (controller: BranchController<Flow>) {
      while (true) {
        yield* pauseFlow()
        controller.transit('Game')
        yield
      }
    },
    Inventory: function* (controller: BranchController<Flow>) {
      while (true) {
        yield* inventoryFlow(world)
        controller.transit('Game')
        yield
      }
    },
    Shop: function* (controller: BranchController<Flow>) {
      while (true) {
        yield* shopFlow(world)
        controller.transit('Game')
        yield
      }
    },
    Movie: function* (controller: BranchController<Flow>) {
      while (true) {
        const [movie] = (yield) as [Movie]
        yield* movieFlow(world, movie)
        controller.transit('Game')
      }
    },
  }).start('Game')
  yield* wait.frame(60)
  world.end()
  return next
}
