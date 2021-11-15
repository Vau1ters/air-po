import { parallelAll } from '@core/behaviour/composite'
import { wait } from '@core/behaviour/wait'
import { KeyController } from '@game/systems/controlSystem'
import { FadeIn } from '../common/animation/fadeIn'
import { Text } from './text'
import { loadStage } from '@game/stage/stageLoader'
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
import { PlayerFactory } from '@game/entities/playerFactory'
import { loadData, PlayerData } from '@game/playdata/playdata'
import { SpawnPoint } from '@game/components/gameEventComponent'
import { GameWorldFactory } from './gameWorldFactory'

export const gameFlow = function*(spawnPoint: SpawnPoint, data: PlayerData, bgm?: Entity): Flow {
  const gameWorldFactory = new GameWorldFactory()
  const world = gameWorldFactory.create()
  const player = new PlayerFactory(world, data).create()
  bgm = bgm ?? new BgmFactory().create()
  world.addEntity(bgm)

  const stage = loadStage(spawnPoint.stageName, world)
  stage.spawnPlayer(player, spawnPoint.spawnerID)

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
      yield* suspendable(isGameOn, parallelAll([transitState(), postEffect(), world.execute()]))
      controller.finish()
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
      return gameFlow(gameEvent.event.spawnPoint, player.getComponent('Player').playerData, bgm)
    case 'playerDie': {
      const { spawnPoint, playerData } = loadData()
      return gameFlow(spawnPoint, playerData, bgm)
    }
  }
}
