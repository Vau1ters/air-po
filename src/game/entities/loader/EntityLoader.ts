import * as t from 'io-ts'
import { PathReporter } from 'io-ts/PathReporter'
import { Entity } from '@core/ecs/entity'
import { AirHolderSettingType, loadAirHolderComponent } from './component/AirHolderComponentLoader'
import {
  AnimationStateSettingType,
  loadAnimationStateComponent,
} from './component/AnimationStateComponentLoader'
import { CollidersSettingType, loadColliderComponent } from './component/ColliderComponentLoader'
import { loadDrawComponent, DrawSettingType } from './component/DrawComponentLoader'
import { loadRigidBodyComponent, RigidBodySettingType } from './component/RigidBodyComponentLoader'
import { entitySetting } from './entitySetting'
import { assert } from '@utils/assertion'

export type EntityName = keyof typeof entitySetting

export const toEntityName = (s: string): EntityName => {
  assert(s in entitySetting, `'${s} is not EntityName`)
  return s as EntityName
}

const EntitySettingType = t.type({
  draw: t.union([DrawSettingType, t.undefined]),
  animationState: t.union([AnimationStateSettingType, t.undefined]),
  collider: t.union([CollidersSettingType, t.undefined]),
  rigidBody: t.union([RigidBodySettingType, t.undefined]),
  airHolder: t.union([AirHolderSettingType, t.undefined]),
})
type EntitySetting = t.TypeOf<typeof EntitySettingType>

export const loadEntity = (name: EntityName): Entity => {
  const setting = entitySetting[name] as EntitySetting
  const decodeResult = EntitySettingType.decode(setting)
  assert(decodeResult._tag === 'Right', PathReporter.report(decodeResult).join('\n'))
  const entity = new Entity()
  if (setting.draw) {
    entity.addComponent('Draw', loadDrawComponent(setting.draw, entity))
  }
  if (setting.animationState) {
    entity.addComponent(
      'AnimationState',
      loadAnimationStateComponent(setting.animationState, entity)
    )
  }
  if (setting.rigidBody) {
    entity.addComponent('RigidBody', loadRigidBodyComponent(setting.rigidBody))
  }
  if (setting.collider) {
    entity.addComponent('Collider', loadColliderComponent(setting.collider, entity))
  }
  if (setting.airHolder) {
    entity.addComponent('AirHolder', loadAirHolderComponent(setting.airHolder))
  }
  return entity
}
