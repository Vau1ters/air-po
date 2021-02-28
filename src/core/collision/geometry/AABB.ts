import { Vec2 } from '@core/math/vec2'
import { Graphics } from 'pixi.js'
import { GeometryForCollision } from './geometry'
import { OBB } from './OBB'

export class AABB implements GeometryForCollision {
  public constructor(
    public center = new Vec2(),
    public size = new Vec2(),
    public maxClipToTolerance = new Vec2()
  ) {}

  public clone(): AABB {
    return new AABB(this.center, this.size, this.maxClipToTolerance)
  }

  public assign(aabb: AABB): void {
    this.center = aabb.center
    this.size = aabb.size
    this.maxClipToTolerance = aabb.maxClipToTolerance
  }

  public static fromMinMax(min: Vec2, max: Vec2): AABB {
    return new AABB(min.add(max).div(2), max.sub(min))
  }

  public static fromPoints(points: Vec2[]): AABB {
    return AABB.fromMinMax(
      points.reduce((a, b) => Vec2.min(a, b)),
      points.reduce((a, b) => Vec2.max(a, b))
    )
  }

  public add(position: Vec2): AABB {
    return new AABB(this.center.add(position), this.size, this.maxClipToTolerance)
  }

  public overlap(other: AABB): boolean {
    return (
      this.max.x >= other.min.x &&
      other.max.x >= this.min.x &&
      this.max.y >= other.min.y &&
      other.max.y >= this.min.y
    )
  }

  public contains(point: Vec2): boolean {
    return (
      this.min.x <= point.x &&
      this.max.x >= point.x &&
      this.min.y <= point.y &&
      this.max.y >= point.y
    )
  }

  public merge(other: AABB): AABB {
    return AABB.fromMinMax(Vec2.min(this.min, other.min), Vec2.max(this.max, other.max))
  }

  public intersect(other: AABB): AABB {
    return AABB.fromMinMax(Vec2.max(this.min, other.min), Vec2.min(this.max, other.max))
  }

  get top(): number {
    return this.center.y - this.size.y / 2
  }

  get bottom(): number {
    return this.center.y + this.size.y / 2
  }

  get left(): number {
    return this.center.x - this.size.x / 2
  }

  get right(): number {
    return this.center.x + this.size.x / 2
  }

  get topLeft(): Vec2 {
    return new Vec2(this.left, this.top)
  }

  get topRight(): Vec2 {
    return new Vec2(this.right, this.top)
  }

  get bottomLeft(): Vec2 {
    return new Vec2(this.left, this.bottom)
  }

  get bottomRight(): Vec2 {
    return new Vec2(this.right, this.bottom)
  }

  get min(): Vec2 {
    return this.topLeft
  }

  get max(): Vec2 {
    return this.bottomRight
  }

  asOBB(): OBB {
    return new OBB(this.clone(), 0)
  }

  createBound(): AABB {
    return this.clone()
  }

  applyPosition(pos: Vec2): AABB {
    return this.add(pos)
  }

  draw(g: Graphics, position: Vec2): void {
    const pos = position.add(this.min)
    g.drawRect(pos.x, pos.y, this.size.x, this.size.y)
  }
}
