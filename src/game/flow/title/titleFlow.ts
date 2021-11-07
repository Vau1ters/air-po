import { loadPlayData, StoryStatus } from '@game/playdata/playdata'
import { MouseController } from '@game/systems/controlSystem'
import * as Sound from '@core/sound/sound'
import { LogoBlinking } from './logoBlinking'
import { FadeOut } from '../common/animation/fadeOut'
import { Sprite } from 'pixi.js'
import { TitleWorldFactory } from '@game/worlds/titleWorldFactory'
import { parallelAny } from '@core/behaviour/composite'
import { gameFlow } from '../game/gameFlow'
import { openingFlow } from '../opening/openingFlow'
import { Flow } from '../flow'
import { getTexture } from '@core/graphics/art'

const createNextFlow = (): Flow => {
  const playData = loadPlayData()

  switch (playData.storyStatus) {
    case StoryStatus.Opening:
      return openingFlow()
    case StoryStatus.Stage: {
      return gameFlow(playData.spawnPoint, {})
    }
  }
}

export const titleFlow = function*(): Flow {
  const world = new TitleWorldFactory().create()

  const titleImage = new Sprite(getTexture('title'))
  world.stage.addChild(titleImage)

  yield* parallelAny([
    (function*(): Generator<void> {
      while (!MouseController.isMousePressed('Left')) yield
      Sound.play('start')
      yield* LogoBlinking(titleImage)
      yield* FadeOut(world)
    })(),
    world.execute(),
  ])
  world.end()
  return createNextFlow()
}
