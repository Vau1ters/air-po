import { Vec2 } from '@core/math/vec2'

export class RigidBodyComponent {
  private _invMass = 0
  private _mass = 0

  public constructor(
    mass = 0,
    public velocity = new Vec2(),
    public acceleration = new Vec2(),
    public restitution = 0,
    public gravityScale = 1
  ) {
    this._mass = mass
    if (mass != 0) {
      this._invMass = 1 / mass
    } else {
      this._invMass = 0
    }
  }

  get mass(): number {
    return this._mass
  }

  set mass(mass: number) {
    this._mass = mass
    if (mass != 0) {
      this._invMass = 1 / mass
    } else {
      this._invMass = 0
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
      this._mass = 0
    }
  }
}
