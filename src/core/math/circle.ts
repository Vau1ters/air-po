import { Vec2 } from './vec2'

export class Circle {
  public constructor(public position = new Vec2(), public radius = 0) {}

  public add(position: Vec2): Circle {
    return new Circle(this.position.add(position), this.radius)
  }

  public overlap(other: Circle): boolean {
    const distX = this.position.x - other.position.x
    const distY = this.position.y - other.position.y
    const dist = Math.sqrt(distX * distX + distY * distY)
    return dist < this.radius + other.radius
  }

  public contains(point: Vec2): boolean {
    const distX = this.position.x - point.x
    const distY = this.position.y - point.y
    const dist = Math.sqrt(distX * distX + distY * distY)
    return dist < this.radius
  }

  get center(): Vec2 {
    return this.position
  }
}
