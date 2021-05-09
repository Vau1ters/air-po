import { Behaviour } from '@core/behaviour/behaviour'
import { World } from '@core/ecs/world'
import { textureStore } from '@core/graphics/art'
import { loadPlayData, StoryStatus } from '@game/playdata/playdata'
import { MouseController } from '@game/systems/controlSystem'
import { Sprite } from 'pixi.js'
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
    case StoryStatus.Stage:
      assert(playData.mapName !== undefined, 'save data is broken')
      return new GameWorldFactory().create(
        (await import(`../../../../../res/map/${playData.mapName}.json`)) as Map
      )
  }
}

export const titleWorldAI = function*(world: World): Behaviour<void> {
  const titleImage = new Sprite(textureStore.title[0])
  world.stage.addChild(titleImage)

  while (!MouseController.isMousePressed('Left')) yield

  yield* LogoBlinking(titleImage)

  yield* FadeOut(world)

  createNextWorld().then(world => world.start())
}
