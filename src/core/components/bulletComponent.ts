import { Vec2 } from '../math/vec2'

export class BulletComponent {
  private static readonly INITIAL_LIFE = 20
  public speed: Vec2
  public life = BulletComponent.INITIAL_LIFE

  constructor(speed: Vec2) {
    this.speed = speed
  }
}
