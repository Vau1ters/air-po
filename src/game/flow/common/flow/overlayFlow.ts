import { windowSize } from '@core/application'
import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAny } from '@core/behaviour/composite'
import { World } from '@core/ecs/world'
import { filters, Graphics } from 'pixi.js'
import { fadeInOut } from '../animation/fadeInOut'

export const overlayFlow = function* <T>(
  world: World,
  config: { behaviour: Behaviour<T> }
): Behaviour<T> {
  const backAlphaFilter = new filters.AlphaFilter(0)
  const frontAlphaFilter = new filters.AlphaFilter(0)
  const background = new Graphics()
  background.beginFill(0, 0.5)
  background.drawRect(0, 0, windowSize.width, windowSize.height)
  background.endFill()
  background.filters = [backAlphaFilter]
  world.stage.addChildAt(background, 0)
  world.stage.filters = world.stage.filters ?? []
  world.stage.filters.push(frontAlphaFilter)

  const fade = fadeInOut(config.behaviour, [backAlphaFilter, frontAlphaFilter])

  const [result] = yield* parallelAny([fade, world.execute()])
  world.end()

  return result
}
