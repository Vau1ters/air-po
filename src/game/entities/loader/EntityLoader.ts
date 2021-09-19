import * as t from 'io-ts'
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
import { HpSettingType, loadHpComponent } from './component/HpComponentLoader'
import { AttackSettingType, loadAttackComponent } from './component/AttackComponentLoader'
import { loadSoundComponent, SoundSettingType } from './component/SoundComponentLoader'
import {
  HorizontalDirectionSettingType,
  loadHorizontalDirectionComponent,
} from './component/HorizontalDirectionLoader'
import { decodeJson } from '@utils/json'

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
  hp: t.union([HpSettingType, t.undefined]),
  attack: t.union([AttackSettingType, t.undefined]),
  sound: t.union([SoundSettingType, t.undefined]),
  horizontalDirection: t.union([HorizontalDirectionSettingType, t.undefined]),
})
type EntitySetting = t.TypeOf<typeof EntitySettingType>

export const loadEntity = (name: EntityName): Entity => {
  const setting = decodeJson<EntitySetting>(entitySetting[name], EntitySettingType)
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
  if (setting.hp) {
    entity.addComponent('Hp', loadHpComponent(setting.hp))
  }
  if (setting.attack) {
    entity.addComponent('Attack', loadAttackComponent(setting.attack))
  }
  if (setting.sound) {
    entity.addComponent('Sound', loadSoundComponent(setting.sound))
  }
  if (setting.horizontalDirection) {
    entity.addComponent(
      'HorizontalDirection',
      loadHorizontalDirectionComponent(setting.horizontalDirection, entity)
    )
  }
  return entity
}
