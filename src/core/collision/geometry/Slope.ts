import { Vec2 } from '@core/math/vec2'
import { assert } from '@utils/assertion'
import { Graphics } from 'pixi.js'
import { AABB } from './AABB'
import { GeometryForCollision } from './geometry'

export class Slope implements GeometryForCollision {
  public constructor(
    public center = new Vec2(),
    public size = new Vec2(),
    public normal = new Vec2()
  ) {
    assert(Math.abs(normal.x) === 1 && Math.abs(normal.y) === 1, 'slope normal must be pm 1')
  }

  createBound(): AABB {
    return new AABB(this.center, this.size)
  }

  applyPosition(pos: Vec2): Slope {
    return new Slope(this.center.add(pos), this.size, this.normal)
  }

  draw(g: Graphics): void {
    const corner = this.normal.mul(this.size).mul(-0.5)
    g.moveTo(this.center.x + corner.x, this.center.y + corner.y)
    g.lineTo(this.center.x - corner.y, this.center.y + corner.x)
    g.lineTo(this.center.x + corner.y, this.center.y - corner.x)
    g.lineTo(this.center.x + corner.x, this.center.y + corner.y)
  }

  solvable(): boolean {
    return true
  }
}
