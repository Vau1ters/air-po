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
import { entitySetting } from './entitySetting.autogen'
import { assert } from '@utils/assertion'
import { HpSettingType, loadHpComponent } from './component/HpComponentLoader'
import { AttackSettingType, loadAttackComponent } from './component/AttackComponentLoader'
import { loadSoundComponent, SoundSettingType } from './component/SoundComponentLoader'
import {
  HorizontalDirectionSettingType,
  loadHorizontalDirectionComponent,
} from './component/HorizontalDirectionLoader'
import { decodeJson } from '@utils/json'
import { LibrarySettingType, loadLibraryComponent } from './component/LibraryComponentLoader'

export type EntityName = keyof typeof entitySetting

export const toEntityName = (s: string): EntityName => {
  assert(s in entitySetting, `'${s} is not EntityName`)
  return s as EntityName
}

const EntitySettingType = t.partial({
  draw: DrawSettingType,
  animationState: AnimationStateSettingType,
  collider: CollidersSettingType,
  rigidBody: RigidBodySettingType,
  airHolder: AirHolderSettingType,
  hp: HpSettingType,
  attack: AttackSettingType,
  sound: SoundSettingType,
  horizontalDirection: HorizontalDirectionSettingType,
  library: LibrarySettingType,
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
  if (setting.library) {
    entity.addComponent('Library', loadLibraryComponent(setting.library))
  }
  return entity
}
