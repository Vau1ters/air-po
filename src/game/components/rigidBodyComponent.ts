import { Vec2 } from '@core/math/vec2'

type BuildRigidBodyOption = {
  mass?: number
  restitution?: number
  airResistance?: number
  gravityScale?: number
  velocity?: Vec2
}

export class RigidBodyComponent {
  public invMass: number
  public restitution: number
  public airResistance: number
  public gravityScale: number
  public velocity: Vec2
  public acceleration = new Vec2()

  public constructor(option?: BuildRigidBodyOption) {
    this.invMass = option?.mass ? 1 / option.mass : 0
    this.restitution = option?.restitution ?? 0
    this.airResistance = option?.airResistance ?? 0
    this.gravityScale = option?.gravityScale ?? 0
    this.velocity = option?.velocity ?? new Vec2()
  }
}
