import * as t from 'io-ts'
import { Vec2 } from '@core/math/vec2'
import { BuildRigidBodyOption, RigidBodyComponent } from '@game/components/rigidBodyComponent'

export const RigidBodySettingType = t.type({
  mass: t.union([t.number, t.undefined]),
  restitution: t.union([t.number, t.undefined]),
  airResistance: t.union([t.number, t.undefined]),
  gravityScale: t.union([t.number, t.undefined]),
  velocity: t.union([t.array(t.number), t.undefined]),
})

export type RigidBodySetting = t.TypeOf<typeof RigidBodySettingType>

const createRigidBodyOption = (setting: RigidBodySetting): BuildRigidBodyOption => {
  return {
    mass: setting.mass,
    restitution: setting.restitution,
    airResistance: setting.airResistance,
    gravityScale: setting.gravityScale,
    velocity: setting.velocity ? new Vec2(...setting.velocity) : undefined,
  }
}

export const loadRigidBodyComponent = (setting: RigidBodySetting): RigidBodyComponent => {
  return new RigidBodyComponent(createRigidBodyOption(setting))
}
