import * as t from 'io-ts'
import { HorizontalDirectionComponent } from '@game/components/horizontalDirectionComponent'
import { Entity } from '@core/ecs/entity'

export const HorizontalDirectionSettingType = t.type({
  looking: t.keyof({ Left: null, Right: null }),
})
export type HorizontalDirectionSetting = t.TypeOf<typeof HorizontalDirectionSettingType>

export const loadHorizontalDirectionComponent = (
  setting: HorizontalDirectionSetting,
  entity: Entity
): HorizontalDirectionComponent => {
  return new HorizontalDirectionComponent(entity, setting.looking)
}
