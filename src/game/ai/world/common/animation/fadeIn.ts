import { windowSize } from '@core/application'
import { Behaviour } from '@core/behaviour/behaviour'
import { In } from '@core/behaviour/easing/functions'
import { stream } from '@core/behaviour/easing/stream'
import { World } from '@core/ecs/world'
import { Graphics } from 'pixi.js'

export const FadeIn = (world: World): Behaviour<void> => {
  const black = new Graphics()
  black.beginFill(0)
  black.drawRect(0, 0, windowSize.width, windowSize.height)
  black.endFill()
  black.alpha = 0
  world.stage.addChild(black)
  return stream(
    (value: number) => {
      black.alpha = value
    },
    1,
    [
      {
        easing: In.linear,
        duration: 30,
        to: 0,
      },
    ]
  )
}
