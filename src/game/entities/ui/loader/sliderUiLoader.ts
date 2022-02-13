import { Entity } from '@core/ecs/entity'
import * as t from 'io-ts'
import { SliderFactory } from '../sliderFactory'

export const SliderUiSettingType = t.type({
  type: t.literal('slider'),
  position: t.tuple([t.number, t.number]),
  min: t.number,
  max: t.number,
})
export type SliderUiSetting = t.TypeOf<typeof SliderUiSettingType>

export const loadSliderUi = (setting: SliderUiSetting): Entity => {
  return new SliderFactory(setting).create()
}
