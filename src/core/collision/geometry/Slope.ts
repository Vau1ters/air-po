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
    const corner: [number, number] = [Math.sign(-this.normal.x), Math.sign(-this.normal.y)]
    g.beginFill()
    g.moveTo(...corner)
    g.lineTo(-corner[1], +corner[0])
    g.lineTo(+corner[1], -corner[0])
    g.endFill()
  }

  solvable(): boolean {
    return true
  }
}
