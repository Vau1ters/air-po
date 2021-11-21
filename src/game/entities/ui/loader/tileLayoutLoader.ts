import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { TileLayoutComponent } from '@game/components/tileLayoutComponent'
import * as t from 'io-ts'
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

export const loadTileLayoutUi = (setting: TileLayoutUiSetting, world: World): Entity => {
  const result = new Entity()
  result.addComponent('TileLayout', new TileLayoutComponent(world, setting))
  return result
}
