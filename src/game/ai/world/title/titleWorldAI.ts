import { Behaviour } from '@core/behaviour/behaviour'
import { In, InOut } from '@core/behaviour/easing/functions'
import { stream } from '@core/behaviour/easing/stream'
import { World } from '@core/ecs/world'
import { textureStore } from '@core/graphics/art'
import { MouseController } from '@game/systems/controlSystem'
import { GameWorldFactory } from '@game/worlds/gameWorldFactory'
import map from '@res/map/stage1_map1.json'
import { Sprite } from 'pixi.js'

export const titleWorldAI = function*(world: World): Behaviour<World> {
  const titleImage = new Sprite(textureStore.title[0])
  titleImage.interactive = true
  world.stage.addChild(titleImage)

  while (!MouseController.isMousePressed('Left')) yield

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

  return new GameWorldFactory().create(map, 0)
}
