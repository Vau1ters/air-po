import { windowSize } from '@core/application'
import { Behaviour } from '@core/behaviour/behaviour'
import { ButtonFactory } from '@game/entities/ui/buttonFactory'
import { KeyController } from '@game/systems/controlSystem'
import { PauseWorldFactory } from '@game/flow/pause/pauseWorldFactory'
import { overlayFlow } from '../common/flow/overlayFlow'

export const pauseFlow = function*(): Behaviour<void> {
  let hasResumeButtonPressed = false

  const world = new PauseWorldFactory().create()

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

  yield* overlayFlow(world, {
    until: () => KeyController.isActionPressed('Pause') || hasResumeButtonPressed,
  })
}
