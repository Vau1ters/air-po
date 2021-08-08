import { AttackComponent } from '@game/components/attackComponent'
import * as t from 'io-ts'

export const AttackSettingType = t.type({
  damage: t.number,
  shouldCounterbalance: t.boolean,
})
export type AttackSetting = t.TypeOf<typeof AttackSettingType>

export const loadAttackComponent = (setting: AttackSetting): AttackComponent => {
  return new AttackComponent(setting.damage, setting.shouldCounterbalance)
}
