import { Vec2 } from '@core/math/vec2'

type BuildRigidBodyOption = {
  mass?: number
  restitution?: number
  gravityScale?: number
  velocity?: Vec2
}

export class RigidBodyComponent {
  private _mass = 0
  private _invMass = 0
  public restitution: number
  public gravityScale: number
  public velocity: Vec2
  public acceleration = new Vec2()

  public constructor(option?: BuildRigidBodyOption) {
    this.mass = option?.mass ?? Infinity
    this.restitution = option?.restitution ?? 0
    this.gravityScale = option?.gravityScale ?? 0
    this.velocity = option?.velocity ?? new Vec2()
  }

  get mass(): number {
    return this._mass
  }

  set mass(mass: number) {
    this._mass = mass
    if (mass != 0) {
      this._invMass = 1 / mass
    } else {
      this._invMass = Infinity
    }
  }

  get invMass(): number {
    return this._invMass
  }

  set invMass(invMass: number) {
    this._invMass = invMass
    if (invMass != 0) {
      this._mass = 1 / invMass
    } else {
      this._mass = Infinity
    }
  }
}
