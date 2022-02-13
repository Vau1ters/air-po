import { Behaviour } from '@core/behaviour/behaviour'
import { KeyController } from '@game/systems/controlSystem'
import { PauseWorldFactory } from '@game/flow/pause/pauseWorldFactory'
import { overlayFlow } from '../common/flow/overlayFlow'
import { loadUi } from '@game/entities/ui/loader/uiLoader'
import { Flow } from '../flow'
import { parallelAny } from '@core/behaviour/composite'
import { wait } from '@core/behaviour/wait'
import { assert } from '@utils/assertion'
import { titleFlow } from '../title/titleFlow'
import { settingFlow } from '../setting/settingFlow'

export const pauseFlow = function* (): Behaviour<Flow | undefined> {
  const world = new PauseWorldFactory().create()

  const ui = loadUi('pause', world)

  return yield* overlayFlow(world, {
    behaviour: (function* (): Behaviour<Flow | undefined> {
      const resume = function* (): Behaviour<boolean> {
        yield* parallelAny([
          wait.notification(ui.get('resumeButton').getComponent('Button').clickEvent),
          wait.until((): boolean => KeyController.isActionPressed('Pause')),
        ])
        return true
      }
      const setting = function* (): Behaviour<boolean> {
        yield* wait.notification(ui.get('settingButton').getComponent('Button').clickEvent)
        return true
      }
      const title = function* (): Behaviour<boolean> {
        yield* wait.notification(ui.get('titleButton').getComponent('Button').clickEvent)
        return true
      }

      const [shouldResume, shouldGotoSetting, shouldGotoTitle] = yield* parallelAny([
        resume(),
        setting(),
        title(),
      ])

      if (shouldResume === true) {
        return
      } else if (shouldGotoSetting) {
        yield* settingFlow()
        return
      } else if (shouldGotoTitle) {
        return titleFlow()
      } else {
        assert(false, 'something wrong')
      }
    })(),
  })
}
