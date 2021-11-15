import { windowSize } from '@core/application'
import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAny } from '@core/behaviour/composite'
import { World } from '@core/ecs/world'
import { filters, Graphics } from 'pixi.js'
import { fadeInOut } from '../animation/fadeInOut'

export const overlayFlow = function*(
  world: World,
  config: { until: () => boolean }
): Behaviour<void> {
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

  const wait = function*(): Behaviour<void> {
    while (!config.until()) yield
  }

  const fadeBack = fadeInOut(wait(), backAlphaFilter)
  const fadeFront = fadeInOut(wait(), frontAlphaFilter)

  yield* parallelAny([fadeBack, fadeFront, world.execute()])
  world.end()
}
