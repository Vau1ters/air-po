import * as t from 'io-ts'
import { HpComponent } from '@game/components/hpComponent'

export const HpSettingType = t.type({
  max: t.number,
  showHpBar: t.union([t.boolean, t.undefined]),
})
export type HpSetting = t.TypeOf<typeof HpSettingType>

export const loadHpComponent = (setting: HpSetting): HpComponent => {
  return new HpComponent(setting.max, setting.max, setting.showHpBar ?? true)
}
