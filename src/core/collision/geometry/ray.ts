import { AABB } from './AABB'
import { Vec2 } from '@core/math/vec2'
import { GeometryForCollision } from './geometry'
import { Graphics } from 'pixi.js'

export class Ray implements GeometryForCollision {
  public constructor(public origin = new Vec2(), public direction = new Vec2()) {}

  createBound(): AABB {
    return new AABB(new Vec2(), new Vec2(Infinity, Infinity))
  }

  applyPosition(pos: Vec2): GeometryForCollision {
    return new Ray(pos.add(this.origin), this.direction)
  }

  draw(_: Graphics): void {}
}
