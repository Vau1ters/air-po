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
