import * as t from 'io-ts'
import { SoundComponent } from '@game/components/soundComponent'

export const SoundSettingType = t.type({})
export type SoundSetting = t.TypeOf<typeof SoundSettingType>

export const loadSoundComponent = (_: SoundSetting): SoundComponent => {
  return new SoundComponent()
}
