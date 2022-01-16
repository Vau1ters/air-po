import * as t from 'io-ts'
import { Entity } from '@core/ecs/entity'
import { createSprite } from '@core/graphics/art'
import { DrawComponent } from '@game/components/drawComponent'
import { spriteURL } from '@core/graphics/spriteURL'

export const ContainerTypes = t.union([t.literal('World'), t.literal('WorldUI'), t.literal('UI')])
export type ContainerType = t.TypeOf<typeof ContainerTypes>

export const DrawSettingType = t.intersection([
  t.type({
    name: t.keyof(spriteURL),
  }),
  t.partial({
    type: ContainerTypes,
    state: t.string,
    zIndex: t.number,
    scale: t.number,
    anchor: t.tuple([t.number, t.number]),
  }),
])
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
