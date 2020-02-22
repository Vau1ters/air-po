import { Vec2 } from './vec2'

export class AABB {
  public constructor(public position = new Vec2(), public size = new Vec2()) {}

  public overlap(other: AABB): boolean {
    return (
      this.position.x + this.size.x > other.position.x &&
      other.position.x + other.size.x > this.position.x &&
      this.position.y + this.size.y > other.position.y &&
      other.position.y + other.size.y > this.position.y
    )
  }

  public merge(other: AABB): AABB {
    const p1 = Vec2.min(this.position, other.position)
    const p2 = Vec2.max(
      this.position.add(this.size),
      other.position.add(other.size)
    )
    const size = p2.sub(p1)

    return new AABB(p1, size)
  }
}
