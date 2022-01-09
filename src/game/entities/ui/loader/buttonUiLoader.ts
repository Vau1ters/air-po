import { Entity } from '@core/ecs/entity'
import * as t from 'io-ts'
import { ButtonFactory } from '../buttonFactory'

export const ButtonUiSettingType = t.type({
  type: t.literal('button'),
  position: t.tuple([t.number, t.number]),
})
type ButtonUiSetting = t.TypeOf<typeof ButtonUiSettingType>

export const loadButtonUi = (setting: ButtonUiSetting): Entity => {
  return new ButtonFactory().setPosition(...setting.position).create()
}
