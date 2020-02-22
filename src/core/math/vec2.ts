export class Vec2 {
  public constructor(public x = 0, public y = 0) {}

  public add(other: Vec2): Vec2 {
    return new Vec2(this.x + other.x, this.y + other.y)
  }

  public sub(other: Vec2): Vec2 {
    return new Vec2(this.x - other.x, this.y - other.y)
  }

  public mul(scalar: number): Vec2 {
    return new Vec2(this.x * scalar, this.y * scalar)
  }

  public div(divisor: number): Vec2 {
    return new Vec2(this.x / divisor, this.y / divisor)
  }

  public dot(other: Vec2): number {
    return this.x * other.x + this.y * other.y
  }

  public cross(other: Vec2): number {
    return this.x * other.y - this.y * other.x
  }

  public lengthSq(): number {
    return this.x * this.x + this.y * this.y
  }

  public length(): number {
    return Math.sqrt(this.lengthSq())
  }

  public normalize(): Vec2 {
    return this.div(this.length())
  }

  public static max(a: Vec2, b: Vec2): Vec2 {
    return new Vec2(Math.max(a.x, b.x), Math.max(a.y, b.y))
  }

  public static min(a: Vec2, b: Vec2): Vec2 {
    return new Vec2(Math.min(a.x, b.x), Math.min(a.y, b.y))
  }
}
