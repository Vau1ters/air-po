import { Behaviour } from '@core/behaviour/behaviour'
import { World } from '@core/ecs/world'
import { loadPlayData, StoryStatus } from '@game/playdata/playdata'
import { MouseController } from '@game/systems/controlSystem'
import * as Sound from '@core/sound/sound'
import { LogoBlinking } from './logoBlinking'
import { OpeningWorldFactory } from '@game/worlds/openingWorldFactory'
import { assert } from '@utils/assertion'
import { FadeOut } from '../common/animation/fadeOut'
import { GameWorldFactory } from '@game/worlds/gameWorldFactory'
import { getSpriteBuffer } from '@core/graphics/art'
import { Sprite } from 'pixi.js'
import { StageName } from '@game/stage/stageLoader'

const createNextWorld = async (): Promise<World> => {
  const playData = loadPlayData()

  switch (playData.status) {
    case StoryStatus.Opening:
      return new OpeningWorldFactory().create()
    case StoryStatus.Stage: {
      assert(playData.mapName !== undefined, 'save data is broken')
      const gameWorldFactory = new GameWorldFactory()
      const gameWorld = gameWorldFactory.create(playData.mapName as StageName)
      gameWorldFactory.spawnPlayer(0)
      return gameWorld
    }
  }
}

export const titleWorldAI = function*(world: World): Behaviour<void> {
  const titleImage = new Sprite(getSpriteBuffer('title').definitions['Default'].textures[0])
  world.stage.addChild(titleImage)

  while (!MouseController.isMousePressed('Left')) yield
  Sound.play('start')

  yield* LogoBlinking(titleImage)

  yield* FadeOut(world)

  createNextWorld().then(world => world.start())
}
