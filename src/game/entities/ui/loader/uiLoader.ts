import { Entity } from '@core/ecs/entity'
import { uiSetting } from './uiSetting.autogen'
import * as t from 'io-ts'
import { ButtonUiSettingType, loadButtonUi } from './buttonUiLoader'
import { decodeJson } from '@utils/json'
import { EntityUiSettingType, loadEntityUi } from './entityUiLoader'
import { loadTextUi, TextUiSettingType } from './textUiLoader'
import { loadTileLayoutUi, TileLayoutUiSettingType } from './tileLayoutLoader'
import { World } from '@core/ecs/world'
import { assert } from '@utils/assertion'
import { Vec2 } from '@core/math/vec2'
import { loadSliderUi, SliderUiSettingType } from './sliderUiLoader'
import { CheckboxUiSettingType, loadCheckboxUi } from './checkboxUiLoader'

export type UiName = keyof typeof uiSetting

export const UiSettingType = t.record(
  t.string,
  t.union([
    ButtonUiSettingType,
    SliderUiSettingType,
    CheckboxUiSettingType,
    TextUiSettingType,
    EntityUiSettingType,
    TileLayoutUiSettingType,
  ])
)
export type UiSetting = t.TypeOf<typeof UiSettingType>

export class Ui {
  private _offset = new Vec2()
  constructor(private entities: { [keys: string]: Entity }) {}

  get(name: string): Entity {
    assert(
      name in this.entities,
      `${name} is not in this UI. candidates are ${Object.keys(this.entities)}`
    )
    return this.entities[name]
  }

  set offset(offset: Vec2) {
    const diff = offset.sub(this._offset)
    this._offset = offset
    for (const e of Object.values(this.entities)) {
      const pos = e.getComponent('Position')
      pos.assign(pos.add(diff))
    }
  }

  get offset(): Vec2 {
    return this._offset
  }
}

export const loadUi = (name: UiName, world: World): Ui => {
  const settings = decodeJson<UiSetting>(uiSetting[name], UiSettingType)
  const result: { [keys: string]: Entity } = {}
  for (const name in settings) {
    const setting = settings[name]
    switch (setting?.type) {
      case 'button':
        world.addEntity((result[name] = loadButtonUi(setting)))
        break
      case 'slider':
        world.addEntity((result[name] = loadSliderUi(setting)))
        break
      case 'checkbox':
        world.addEntity((result[name] = loadCheckboxUi(setting)))
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
