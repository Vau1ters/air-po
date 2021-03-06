import { Behaviour } from '@core/behaviour/behaviour'
import { World } from '@core/ecs/world'
import { textureStore } from '@core/graphics/art'
import { loadPlayData, StoryStatus } from '@game/playdata/playdata'
import { MouseController } from '@game/systems/controlSystem'
import { Sprite } from 'pixi.js'
import * as Sound from '@core/sound/sound'
import { LogoBlinking } from './logoBlinking'
import { OpeningWorldFactory } from '@game/worlds/openingWorldFactory'
import { assert } from '@utils/assertion'
import { FadeOut } from '../common/animation/fadeOut'
import { GameWorldFactory } from '@game/worlds/gameWorldFactory'
import { Map } from '@game/map/mapBuilder'

const createNextWorld = async (): Promise<World> => {
  const playData = loadPlayData()

  switch (playData.status) {
    case StoryStatus.Opening:
      return new OpeningWorldFactory().create()
    case StoryStatus.Stage: {
      assert(playData.mapName !== undefined, 'save data is broken')
      const gameWorldFactory = new GameWorldFactory()
      const gameWorld = gameWorldFactory.create(
        (await import(`../../../../../res/map/${playData.mapName}.json`)) as Map
      )
      gameWorldFactory.spawnPlayer(0)
      return gameWorld
    }
  }
}

export const titleWorldAI = function*(world: World): Behaviour<void> {
  const titleImage = new Sprite(textureStore.title[0])
  world.stage.addChild(titleImage)

  while (!MouseController.isMousePressed('Left')) yield
  Sound.play('start')

  yield* LogoBlinking(titleImage)

  yield* FadeOut(world)

  createNextWorld().then(world => world.start())
}
