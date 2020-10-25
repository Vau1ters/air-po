import { Behaviour } from '@core/behaviour/behaviour'
import { World } from '@core/ecs/world'
import { MouseController } from '@game/systems/controlSystem'
import { transition } from '@core/behaviour/easing/transition'
import { GameWorldFactory } from '@game/worlds/gameWorldFactory'
import { Sprite } from 'pixi.js'
import { textureStore } from '@core/graphics/art'

export const titleWorldAI = function*(world: World): Behaviour<World> {
  const titleImage = new Sprite(textureStore.title[0])
  titleImage.interactive = true
  world.stage.addChild(titleImage)

  while (!MouseController.isMousePressed('Left')) yield
  yield* transition(12, (time: number) => {
    const rate = time / 12
    titleImage.alpha = (Math.cos(rate * Math.PI * 4) + 1) / 2
  })
  yield* transition(16, (time: number) => {
    const rate = time / 16
    titleImage.alpha = Math.cos((rate * Math.PI) / 2)
  })

  return new GameWorldFactory().create()
}
