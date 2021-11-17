import { Entity } from '@core/ecs/entity'
import { uiSetting } from './uiSetting'
import * as t from 'io-ts'
import { ButtonUiSettingType, loadButtonUi } from './buttonUiLoader'
import { decodeJson } from '@utils/json'
import { EntityUiSettingType, loadEntityUi } from './entityUiLoader'
import { loadTextUi, TextUiSettingType } from './textUiLoader'
import { loadTileLayoutUi, TileLayoutUiSettingType } from './tileLayoutLoader'
import { World } from '@core/ecs/world'
import { TileLayout } from '../tileLayout'
import { assert } from '@utils/assertion'

export type UiName = keyof typeof uiSetting
export type UiElement = Entity | TileLayout

export const UiSettingType = t.record(
  t.string,
  t.union([ButtonUiSettingType, TextUiSettingType, EntityUiSettingType, TileLayoutUiSettingType])
)
export type UiSetting = t.TypeOf<typeof UiSettingType>

export class Ui {
  constructor(private elements: { [keys: string]: UiElement }) {}

  getEntity(name: string): Entity {
    const e = this.elements[name]
    assert(e instanceof Entity, `${name} is not Entity`)
    return e
  }

  getTileLayout(name: string): TileLayout {
    const e = this.elements[name]
    assert(e instanceof TileLayout, `${name} is not TileLayout`)
    return e
  }
}

export const loadUi = (name: UiName, world: World): Ui => {
  const settings = decodeJson<UiSetting>(uiSetting[name], UiSettingType)
  const result: { [keys: string]: UiElement } = {}
  for (const name in settings) {
    const setting = settings[name]
    switch (setting?.type) {
      case 'button':
        world.addEntity((result[name] = loadButtonUi(setting)))
        break
      case 'text':
        world.addEntity((result[name] = loadTextUi(setting)))
        break
      case 'entity':
        world.addEntity((result[name] = loadEntityUi(setting)))
        break
      case 'tileLayout':
        result[name] = loadTileLayoutUi(setting, world)
        break
    }
  }
  return new Ui(result)
}
