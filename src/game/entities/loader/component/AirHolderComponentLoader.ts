import * as t from 'io-ts'

import { AirHolderComponent } from '@game/components/airHolderComponent'

export const AirHolderSettingType = t.intersection([
  t.type({
    initialQuantity: t.number,
    maxQuantity: t.number,
    consumeSpeed: t.number,
    collectSpeed: t.number,
    shouldDamageInSuffocation: t.boolean,
  }),
  t.partial({
    emitSpeed: t.number,
  }),
])
export type AirHolderSetting = t.TypeOf<typeof AirHolderSettingType>

export const loadAirHolderComponent = (setting: AirHolderSetting): AirHolderComponent => {
  return new AirHolderComponent(setting)
}
