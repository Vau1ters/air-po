import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'

export class BulletComponent {
  private static readonly INITIAL_LIFE = 20
  public previousPos: Vec2

  constructor(entity: Entity, public life: number = BulletComponent.INITIAL_LIFE) {
    this.previousPos = entity.getComponent('Position')
  }
}
