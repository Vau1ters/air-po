import { Entity } from '@core/ecs/entity'
import { AnimationSprite } from '@core/graphics/animation'

export class AnimationStateComponent {
  public animation: AnimationSprite

  constructor(entity: Entity) {
    this.animation = (entity.getComponent('Draw').children as [AnimationSprite])[0]
  }

  set isVisible(value: boolean) {
    this.animation.isVisible = value
  }

  get isVisible(): boolean {
    return this.animation.isVisible
  }

  set state(value: string) {
    this.animation.state = value
  }

  get state(): string {
    return this.animation.state
  }
}
