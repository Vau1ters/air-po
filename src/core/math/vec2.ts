import { Point } from 'pixi.js'

export class Vec2 {
  public constructor(public x = 0, public y = 0) {}

  public assign(v: Vec2): Vec2 {
    this.x = v.x
    this.y = v.y
    return this
  }

  public copy(): Vec2 {
    return new Vec2(this.x, this.y)
  }

  public add(other: number | Vec2): Vec2 {
    if (other instanceof Vec2) {
      return new Vec2(this.x + other.x, this.y + other.y)
    } else {
      return new Vec2(this.x + other, this.y + other)
    }
  }

  public addFrom(other: Vec2): void {
    this.x += other.x
    this.y += other.y
  }

  public abs(): Vec2 {
    return new Vec2(Math.abs(this.x), Math.abs(this.y))
  }

  public sub(other: number | Vec2): Vec2 {
    if (other instanceof Vec2) {
      return new Vec2(this.x - other.x, this.y - other.y)
    } else {
      return new Vec2(this.x - other, this.y - other)
    }
  }

  public subFrom(other: Vec2): void {
    this.x -= other.x
    this.y -= other.y
  }

  public mul(m: number | Vec2): Vec2 {
    if (m instanceof Vec2) {
      return new Vec2(this.x * m.x, this.y * m.y)
    } else {
      return new Vec2(this.x * m, this.y * m)
    }
  }

  public div(d: number | Vec2): Vec2 {
    if (d instanceof Vec2) {
      return new Vec2(this.x / d.x, this.y / d.y)
    } else {
      return new Vec2(this.x / d, this.y / d)
    }
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

  public static fromPoint(p: Point): Vec2 {
    return new Vec2(p.x, p.y)
  }

  public static max(a: Vec2, b: Vec2): Vec2 {
    return new Vec2(Math.max(a.x, b.x), Math.max(a.y, b.y))
  }

  public static min(a: Vec2, b: Vec2): Vec2 {
    return new Vec2(Math.min(a.x, b.x), Math.min(a.y, b.y))
  }

  public static mix(a: Vec2, b: Vec2, t: number): Vec2 {
    return a.add(b.sub(a).mul(t))
  }
}
