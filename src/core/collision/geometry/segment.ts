import { Vec2 } from '@core/math/vec2'
import { Graphics } from 'pixi.js'
import { AABB } from './AABB'
import { GeometryForCollision } from './geometry'

export class Segment implements GeometryForCollision {
  private _start: Vec2
  private _end: Vec2
  private _direction: Vec2
  private shouldUpdateDirection = true

  public constructor(start = new Vec2(), end = new Vec2()) {
    this._start = start
    this._end = end
    this._direction = new Vec2()
  }

  createBound(): AABB {
    return new AABB()
  }

  applyPosition(pos: Vec2): GeometryForCollision {
    return new Segment(pos.add(this.start), pos.add(this.end))
  }

  draw(_: Graphics): void {}

  solvable(): boolean {
    return false
  }

  distance(p: Vec2): number {
    const s = this.start
    const v = this.direction
    // <s + vt - p, v> = 0
    // t = <p - s, v> / <v, v>
    const t = Math.max(0, p.sub(s).dot(v) / v.dot(v))
    return s.add(v.mul(t)).sub(p).length()
  }

  public get start(): Vec2 {
    return this._start
  }

  public set start(_start: Vec2) {
    this._start = _start
    this.shouldUpdateDirection = true
  }

  public get end(): Vec2 {
    return this._end
  }

  public set end(_end: Vec2) {
    this._end = _end
    this.shouldUpdateDirection = true
  }

  public get direction(): Vec2 {
    if (this.shouldUpdateDirection) {
      this.shouldUpdateDirection = false
      this._direction = this._end.sub(this._start).normalize()
    }
    return this._direction
  }
}
