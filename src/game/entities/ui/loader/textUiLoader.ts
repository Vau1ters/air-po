import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { TextFactory } from '@game/entities/textFactory'
import * as t from 'io-ts'

export const TextUiSettingType = t.type({
  type: t.literal('text'),
  fontSize: t.number,
  position: t.union([t.tuple([t.number, t.number]), t.undefined]),
  tint: t.union([t.number, t.undefined]),
})
type TextUiSetting = t.TypeOf<typeof TextUiSettingType>

export const loadTextUi = (setting: TextUiSetting): Entity => {
  return new TextFactory({
    fontSize: setting.fontSize,
    pos: setting.position ? new Vec2(...setting.position) : undefined,
    tint: setting.tint,
  }).create()
}
