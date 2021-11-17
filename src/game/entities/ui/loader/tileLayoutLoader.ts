import { World } from '@core/ecs/world'
import * as t from 'io-ts'
import { TileLayout } from '../tileLayout'
import { EntityUiSettingType } from './entityUiLoader'

export const TileLayoutUiSettingType = t.type({
  type: t.literal('tileLayout'),
  element: EntityUiSettingType,
  tileCount: t.tuple([t.number, t.number]),
  fillElements: t.boolean,
  layoutOption: t.union([
    t.type({
      center: t.tuple([t.number, t.number]),
      size: t.tuple([t.number, t.number]),
    }),
    t.type({
      offset: t.tuple([t.number, t.number]),
      shift: t.tuple([t.number, t.number]),
    }),
  ]),
})
export type TileLayoutUiSetting = t.TypeOf<typeof TileLayoutUiSettingType>

export const loadTileLayoutUi = (setting: TileLayoutUiSetting, world: World): TileLayout => {
  return new TileLayout(world, setting)
}
