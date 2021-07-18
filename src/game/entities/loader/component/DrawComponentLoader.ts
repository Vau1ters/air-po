import * as t from 'io-ts'
import { Entity } from '@core/ecs/entity'
import { createSprite } from '@core/graphics/art'
import { DrawComponent } from '@game/components/drawComponent'
import { spriteURL } from '@core/graphics/spriteURL'

export const DrawSettingType = t.type({
  name: t.keyof(spriteURL),
  state: t.union([t.string, t.undefined]),
})
export type DrawSetting = t.TypeOf<typeof DrawSettingType>

export const loadDrawComponent = (setting: DrawSetting, entity: Entity): DrawComponent => {
  return new DrawComponent({
    entity,
    child: {
      sprite: createSprite(setting.name),
      state: setting.state,
    },
  })
}
