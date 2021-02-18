import { Vec2 } from '@core/math/vec2'
import { AABB } from './aabb'

export class Circle {
  public constructor(public position = new Vec2(), public radius = 0) {}

  public add(position: Vec2): Circle {
    return new Circle(this.position.add(position), this.radius)
  }

  public overlap(other: Circle): boolean {
    const distSq = this.radius + other.radius
    return this.position.sub(other.position).lengthSq() < distSq * distSq
  }

  public contains(point: Vec2): boolean {
    return this.position.sub(point).lengthSq() < this.radius * this.radius
  }

  public createBound(): AABB {
    return new AABB(
      this.position.sub(new Vec2(this.radius, this.radius)),
      new Vec2(this.radius, this.radius).mul(2)
    )
  }

  get center(): Vec2 {
    return this.position
  }
}
