import { windowSize } from '@core/application'
import { Behaviour } from '@core/behaviour/behaviour'
import { ease } from '@core/behaviour/easing/easing'
import { In } from '@core/behaviour/easing/functions'
import { World } from '@core/ecs/world'
import { Graphics } from 'pixi.js'

type FadeOption = {
  duration?: number
  mode: 'in' | 'out'
}

export function* fadeBlack(world: World, option: FadeOption): Behaviour<void> {
  const black = new Graphics()
  black.beginFill(0)
  black.drawRect(0, 0, windowSize.width, windowSize.height)
  black.endFill()
  world.stage.addChild(black)

  const animation = ease(In.linear)(
    option.duration ?? 30,
    (value: number) => {
      black.alpha = value
    },
    {
      from: option.mode === 'in' ? 1 : 0,
      to: option.mode === 'in' ? 0 : 1,
    }
  )
  yield* animation
}
