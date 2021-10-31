import { parallelAll } from '@core/behaviour/composite'
import { wait } from '@core/behaviour/wait'
import { KeyController } from '@game/systems/controlSystem'
import { GameWorldFactory } from '@game/worlds/gameWorldFactory'
import { FadeIn } from '../common/animation/fadeIn'
import { Text } from './text'
import { loadStage, StageName } from '@game/stage/stageLoader'
import { suspendable } from '@core/behaviour/suspendable'
import { pauseFlow } from '../pause/pauseFlow'
import { Flow } from '../flow'
import { getSingleton } from '@game/systems/singletonSystem'
import { assert } from '@utils/assertion'
import { BgmFactory } from '@game/entities/bgmFactory'
import { Entity } from '@core/ecs/entity'
import { branch, BranchController } from '@core/behaviour/branch'
import { Behaviour } from '@core/behaviour/behaviour'
import { inventoryFlow } from '../inventory/inventoryFlow'

export const gameFlow = function*(stageName: StageName, spawnerID?: number, bgm?: Entity): Flow {
  const gameWorldFactory = new GameWorldFactory()
  const world = gameWorldFactory.create()
  if (!bgm) {
    bgm = new BgmFactory().create()
  }
  world.addEntity(bgm)
  const stage = loadStage(stageName, world)

  stage.spawnPlayer(spawnerID ?? 0)

  const gameEvent = getSingleton('GameEvent', world).getComponent('GameEvent')

  const isGameOn = (): boolean => gameEvent.event === undefined

  yield* branch({
    Game: function*(controller: BranchController) {
      const transitState = function*(): Behaviour<void> {
        while (true) {
          if (KeyController.isActionPressed('Pause')) {
            controller.transit('Pause')
          }
          if (KeyController.isActionPressed('Inventory')) {
            controller.transit('Inventory')
          }
          yield
        }
      }
      const postEffect = function*(): Generator<void> {
        yield* FadeIn(world)
        yield* Text(world, 'そうなんちてん')
      }
      const gameExecute = suspendable(isGameOn, world.execute())
      yield* parallelAll([transitState(), postEffect(), gameExecute])
    },
    Pause: function*(controller: BranchController) {
      while (true) {
        yield* pauseFlow()
        controller.transit('Game')
        yield
      }
    },
    Inventory: function*(controller: BranchController) {
      while (true) {
        yield* inventoryFlow(world)
        controller.transit('Game')
        yield
      }
    },
  }).start('Game')
  yield* wait(60)
  world.end()

  assert(gameEvent.event !== undefined, '')

  switch (gameEvent.event.type) {
    case 'move':
      return gameFlow(gameEvent.event.mapName, gameEvent.event.spawnerID, bgm)
    case 'playerDie':
      return gameFlow(
        stageName,
        getSingleton('Player', world).getComponent('Player').spawnerID,
        bgm
      )
  }
}
