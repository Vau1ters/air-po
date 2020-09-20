import { Vec2 } from '../math/vec2'

export class BulletComponent {
  private static readonly INITIAL_LIFE = 20
  public speed: Vec2
  public life: number

  constructor(speed: Vec2, life: number = BulletComponent.INITIAL_LIFE) {
    this.speed = speed
    this.life = life
  }
}
