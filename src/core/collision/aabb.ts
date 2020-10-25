import { Vec2 } from '../math/vec2'

export class AABB {
  public constructor(public position = new Vec2(), public size = new Vec2()) {}

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
    const p1 = Vec2.min(this.position, other.position)
    const p2 = Vec2.max(this.position.add(this.size), other.position.add(other.size))
    const size = p2.sub(p1)

    return new AABB(p1, size)
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
    return new Vec2(this.right, this.top)
  }

  get center(): Vec2 {
    return this.position.add(this.size.div(2))
  }
}
