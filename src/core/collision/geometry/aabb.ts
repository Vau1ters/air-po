import { Vec2 } from '@core/math/vec2'
import { Graphics } from 'pixi.js'
import { GeometryForCollision } from './geometry'
import { OBB } from './obb'

export class AABB implements GeometryForCollision {
  public constructor(
    public position = new Vec2(),
    public size = new Vec2(),
    public maxClipToTolerance = new Vec2()
  ) {}

  public clone(): AABB {
    return new AABB(this.position, this.size, this.maxClipToTolerance)
  }

  public static fromMinMax(min: Vec2, max: Vec2): AABB {
    return new AABB(min, max.sub(min))
  }

  public add(position: Vec2): AABB {
    return new AABB(this.position.add(position), this.size)
  }

  public overlap(other: AABB): boolean {
    return (
      this.position.x + this.size.x >= other.position.x &&
      other.position.x + other.size.x >= this.position.x &&
      this.position.y + this.size.y >= other.position.y &&
      other.position.y + other.size.y >= this.position.y
    )
  }

  public contains(point: Vec2): boolean {
    return (
      this.position.x <= point.x &&
      this.position.x + this.size.x >= point.x &&
      this.position.y <= point.y &&
      this.position.y + this.size.y >= point.y
    )
  }

  public merge(other: AABB): AABB {
    return AABB.fromMinMax(Vec2.min(this.min, other.min), Vec2.max(this.max, other.max))
  }

  public intersect(other: AABB): AABB {
    return AABB.fromMinMax(Vec2.max(this.min, other.min), Vec2.min(this.max, other.max))
  }

  get top(): number {
    return this.position.y
  }

  get bottom(): number {
    return this.position.y + this.size.y
  }

  get left(): number {
    return this.position.x
  }

  get right(): number {
    return this.position.x + this.size.x
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

  get center(): Vec2 {
    return this.position.add(this.size.div(2))
  }

  set center(c: Vec2) {
    this.position.assign(c.sub(this.size.div(2)))
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
    const pos = position.add(this.position)
    g.drawRect(pos.x, pos.y, this.size.x, this.size.y)
  }
}
