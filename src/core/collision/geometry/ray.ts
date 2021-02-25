import { AABB } from './aabb'
import { Vec2 } from '@core/math/vec2'
import { GeometryForCollision } from './geometry'
import { Graphics } from 'pixi.js'

export class Ray implements GeometryForCollision {
  public constructor(public origin = new Vec2(), public direction = new Vec2()) {}

  createBound(): AABB {
    const big = 114514 // cannot use Infinity since coordinate of right edge become NaN (-Infinity + Infinity)
    return new AABB(new Vec2(-big, -big), new Vec2(+big * 2, +big * 2))
  }

  applyPosition(pos: Vec2): GeometryForCollision {
    return new Ray(pos.add(this.origin), this.direction)
  }

  draw(_: Graphics, __: Vec2): void {}
}
