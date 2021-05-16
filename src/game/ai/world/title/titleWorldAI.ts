import { Behaviour } from '@core/behaviour/behaviour'
import { In, InOut } from '@core/behaviour/easing/functions'
import { stream } from '@core/behaviour/easing/stream'
import { World } from '@core/ecs/world'
import { textureStore } from '@core/graphics/art'
import { MouseController } from '@game/systems/controlSystem'
import { GameWorldFactory } from '@game/worlds/gameWorldFactory'
import map from '@res/map/teststage.json'
import { Sprite } from 'pixi.js'
import * as Sound from '@core/sound/sound'

export const titleWorldAI = function*(world: World): Behaviour<void> {
  const titleImage = new Sprite(textureStore.title[0])
  titleImage.interactive = true
  world.stage.addChild(titleImage)

  while (!MouseController.isMousePressed('Left')) yield
  Sound.play('start')

  yield* stream(
    (value: number) => {
      titleImage.alpha = value
    },
    1,
    [
      {
        easing: InOut.sine,
        duration: 3,
        to: 0,
      },
      {
        easing: InOut.sine,
        duration: 3,
        to: 1,
      },
      {
        easing: InOut.sine,
        duration: 3,
        to: 0,
      },
      {
        easing: InOut.sine,
        duration: 3,
        to: 1,
      },
      {
        easing: In.sine,
        duration: 16,
        to: 0,
      },
    ]
  )

  const gameWorldFactory = new GameWorldFactory()
  const gameWorld = gameWorldFactory.create(map)
  gameWorldFactory.spawnPlayer(0)
  gameWorld.start()
}
