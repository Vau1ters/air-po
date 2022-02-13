import { Behaviour } from '@core/behaviour/behaviour'
import { overlayFlow } from '../common/flow/overlayFlow'
import { loadUi } from '@game/entities/ui/loader/uiLoader'
import { SettingWorldFactory } from './settingWorldFactory'
import { suspendable } from '@core/behaviour/suspendable'
import { KeyController } from '@game/systems/controlSystem'
import { loadData, saveData } from '@game/playdata/playdata'
import * as Sound from '@core/sound/sound'
import { applicationSetting } from '@core/application'

export const settingFlow = function* (): Behaviour<void> {
  const world = new SettingWorldFactory().create()

  const ui = loadUi('setting', world)

  const soundVolumeSlider = ui.get('soundVolumeSlider').getComponent('Slider')
  soundVolumeSlider.value = loadData().masterVolume
  soundVolumeSlider.addCallback((value: number): void => {
    const data = loadData()
    saveData({
      ...data,
      masterVolume: value,
    })
    Sound.setMasterVolume(value)
  })

  const pixelPerfectCheckbox = ui.get('pixelPerfectCheckbox').getComponent('Checkbox')
  pixelPerfectCheckbox.value = loadData().pixelPerfect
  pixelPerfectCheckbox.addCallback((value: boolean): void => {
    const data = loadData()
    saveData({
      ...data,
      pixelPerfect: value,
    })
    applicationSetting.screenScaleMode = value ? 'Integer' : 'Float'
  })

  return yield* overlayFlow(world, {
    behaviour: (function* (): Behaviour<void> {
      yield* suspendable((): boolean => !KeyController.isKeyPressed('Escape'), world.execute())
    })(),
  })
}
