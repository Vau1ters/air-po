import * as t from 'io-ts'

import { AirHolderComponent } from '@game/components/airHolderComponent'

export const AirHolderSettingType = t.partial({
  initialQuantity: t.number,
  maxQuantity: t.number,
  consumeSpeed: t.number,
  collectSpeed: t.number,
  emitSpeed: t.number,
  shouldDamageInSuffocation: t.boolean,
})

export type AirHolderSetting = t.TypeOf<typeof AirHolderSettingType>

export const loadAirHolderComponent = (setting: AirHolderSetting): AirHolderComponent => {
  return new AirHolderComponent(setting)
}
