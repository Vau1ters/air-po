import * as t from 'io-ts'

import { AirHolderComponent, AirHolderSetting } from '@game/components/airHolderComponent'

export const AirHolderSettingType = t.type({
  initialQuantity: t.number,
  maxQuantity: t.number,
  consumeSpeed: t.number,
  collectSpeed: t.number,
  shouldDamageInSuffocation: t.boolean,
})

export const loadAirHolderComponent = (setting: AirHolderSetting): AirHolderComponent => {
  return new AirHolderComponent(setting)
}
