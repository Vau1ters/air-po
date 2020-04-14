import { Vec2 } from '../math/vec2'

export class BulletComponent {
  public speed: Vec2

  constructor(speed: Vec2) {
    this.speed = speed
  }
}
