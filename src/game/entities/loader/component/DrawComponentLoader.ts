import * as t from 'io-ts'
import { Entity } from '@core/ecs/entity'
import { createSprite } from '@core/graphics/art'
import { DrawComponent } from '@game/components/drawComponent'
import { spriteURL } from '@core/graphics/spriteURL'

export const ContainerTypes = t.union([t.literal('World'), t.literal('WorldUI'), t.literal('UI')])
export type ContainerType = t.TypeOf<typeof ContainerTypes>
export const DrawSettingType = t.type({
  name: t.keyof(spriteURL),
  type: t.union([ContainerTypes, t.undefined]),
  state: t.union([t.string, t.undefined]),
  zIndex: t.union([t.number, t.undefined]),
  scale: t.union([t.number, t.undefined]),
  anchor: t.union([t.tuple([t.number, t.number]), t.undefined]),
})
export type DrawSetting = t.TypeOf<typeof DrawSettingType>

export const loadDrawComponent = (setting: DrawSetting, entity: Entity): DrawComponent => {
  return new DrawComponent({
    entity,
    type: setting.type,
    scale: setting.scale,
    child: {
      sprite: createSprite(
        setting.name,
        setting.anchor ? { x: setting.anchor[0], y: setting.anchor[1] } : undefined
      ),
      state: setting.state,
      zIndex: setting.zIndex,
    },
  })
}
