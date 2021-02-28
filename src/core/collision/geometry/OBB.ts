import { Vec2 } from '@core/math/vec2'
import { Graphics } from 'pixi.js'
import { AABB } from './AABB'
import { GeometryForCollision } from './geometry'

export class OBB implements GeometryForCollision {
  constructor(public bound: AABB, public angle = 0) {}

  createBound(): AABB {
    const { angle } = this
    const { center, size: s } = this.bound
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const width = Math.abs(s.x * cos) + Math.abs(s.y * sin)
    const height = Math.abs(s.x * sin) + Math.abs(s.y * cos)
    return new AABB(center, new Vec2(width, height))
  }

  applyPosition(pos: Vec2): OBB {
    return new OBB(this.bound.add(pos), this.angle)
  }

  draw(_: Graphics, __: Vec2): void {}

  get axisX(): Vec2 {
    return new Vec2(Math.cos(this.angle), Math.sin(this.angle))
  }

  get axisY(): Vec2 {
    return new Vec2(-Math.sin(this.angle), Math.cos(this.angle))
  }
}
