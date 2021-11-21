import { Behaviour } from '@core/behaviour/behaviour'
import { KeyController } from '@game/systems/controlSystem'
import { PauseWorldFactory } from '@game/flow/pause/pauseWorldFactory'
import { overlayFlow } from '../common/flow/overlayFlow'
import { loadUi } from '@game/entities/ui/loader/uiLoader'

export const pauseFlow = function*(): Behaviour<void> {
  let hasResumeButtonPressed = false

  const world = new PauseWorldFactory().create()

  const ui = loadUi('pause', world)

  ui.get('button1')
    .getComponent('Button')
    .clickEvent.addObserver((): void => {
      hasResumeButtonPressed = true
    })

  yield* overlayFlow(world, {
    until: () => KeyController.isActionPressed('Pause') || hasResumeButtonPressed,
  })
}
