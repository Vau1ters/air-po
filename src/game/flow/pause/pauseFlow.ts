import { windowSize } from '@core/application'
import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAny } from '@core/behaviour/composite'
import { ButtonFactory } from '@game/entities/ui/buttonFactory'
import { KeyController } from '@game/systems/controlSystem'
import { PauseWorldFactory } from '@game/worlds/pauseWorldFactory'
import { fadeInOut } from '../common/animation/fadeInOut'

export const pauseFlow = function*(): Behaviour<void> {
  let hasResumeButtonPressed = false

  const { world, alphaFilter } = new PauseWorldFactory().create()

  const button1 = new ButtonFactory()
    .setPosition(windowSize.width / 2, windowSize.height / 2 - 50)
    .onClick(() => {
      hasResumeButtonPressed = true
    })
    .create()
  world.addEntity(button1)

  const button2 = new ButtonFactory()
    .setPosition(windowSize.width / 2, windowSize.height / 2)
    .create()
  world.addEntity(button2)

  const button3 = new ButtonFactory()
    .setPosition(windowSize.width / 2, windowSize.height / 2 + 50)
    .create()
  world.addEntity(button3)

  const waitKey = function*(): Behaviour<void> {
    while (!KeyController.isActionPressed('Pause') && !hasResumeButtonPressed) yield
  }

  yield* parallelAny([fadeInOut(waitKey(), alphaFilter), world.execute()])
  world.end()
}
