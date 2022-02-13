import { Entity } from '@core/ecs/entity'
import * as t from 'io-ts'
import { CheckboxFactory } from '../checkboxFactory'

export const CheckboxUiSettingType = t.type({
  type: t.literal('checkbox'),
  position: t.tuple([t.number, t.number]),
})
export type CheckboxUiSetting = t.TypeOf<typeof CheckboxUiSettingType>

export const loadCheckboxUi = (setting: CheckboxUiSetting): Entity => {
  return new CheckboxFactory(setting).create()
}
