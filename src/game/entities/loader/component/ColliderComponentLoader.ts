import * as t from 'io-ts'
import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import {
  buildColliders,
  ColliderBuildOption,
  ColliderComponent,
  GeometryBuildOption,
} from '@game/components/colliderComponent'
import { CategoryDef, CategorySet } from '@game/entities/category'

const AABBSettingType = t.type({
  type: t.literal('AABB'),
  offset: t.union([t.array(t.number), t.undefined]),
  size: t.union([t.array(t.number), t.undefined]),
  maxClipToTolerance: t.union([t.array(t.number), t.undefined]),
})

const SlopeSettingType = t.type({
  type: t.literal('Slope'),
  size: t.union([t.array(t.number), t.undefined]),
  normal: t.array(t.number),
})

const SegmentSettingType = t.type({
  type: t.literal('Segment'),
})

const GeometrySettingType = t.union([AABBSettingType, SlopeSettingType, SegmentSettingType])
export type GeometrySetting = t.TypeOf<typeof GeometrySettingType>

const CategoryType = t.keyof(CategoryDef)

const ColliderSettingType = t.type({
  geometry: GeometrySettingType,
  category: CategoryType,
  mask: t.union([t.array(CategoryType), t.undefined]),
  tag: t.union([t.array(t.string), t.undefined]),
  solveDir: t.union([t.array(t.array(t.number)), t.undefined]),
})
type ColliderSetting = t.TypeOf<typeof ColliderSettingType>

export const CollidersSettingType = t.array(ColliderSettingType)
export type CollidersSetting = t.TypeOf<typeof CollidersSettingType>

const createGeometryBuildOption = (setting: GeometrySetting): GeometryBuildOption => {
  switch (setting.type) {
    case 'AABB':
      return {
        type: 'AABB',
        offset: setting.offset ? new Vec2(...setting.offset) : undefined,
        size: setting.size ? new Vec2(...setting.size) : undefined,
        maxClipToTolerance: setting.maxClipToTolerance
          ? new Vec2(...setting.maxClipToTolerance)
          : undefined,
      }
    case 'Slope':
      return {
        type: 'Slope',
        size: setting.size ? new Vec2(...setting.size) : undefined,
        normal: setting.normal ? new Vec2(...setting.normal) : undefined,
      }
    case 'Segment':
      return {
        type: 'Segment',
      }
  }
}

const createColliderBuildOption = (setting: ColliderSetting): ColliderBuildOption => {
  return {
    geometry: createGeometryBuildOption(setting.geometry),
    category: setting.category,
    mask: setting.mask ? new CategorySet(...setting.mask) : undefined,
    tag: setting.tag,
    solveDir: setting.solveDir?.map(d => new Vec2(...d)),
  }
}

export const loadColliderComponent = (
  setting: CollidersSetting,
  entity: Entity
): ColliderComponent => {
  return new ColliderComponent(
    ...buildColliders({
      entity,
      colliders: setting.map(s => createColliderBuildOption(s)),
    })
  )
}
