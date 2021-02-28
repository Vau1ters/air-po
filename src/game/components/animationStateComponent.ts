import { Entity } from '@core/ecs/entity'
import { AnimationSprite } from '@core/graphics/animation'
import { EventNotifier } from '@utils/eventNotifier'

export class AnimationStateComponent {
  public animation: AnimationSprite
  private _state = ''
  private _isVisible = true

  public readonly changeState = new EventNotifier<string>()
  public readonly changeIsVisible = new EventNotifier<boolean>()

  constructor(entity: Entity) {
    this.animation = (entity.getComponent('Draw').children as [AnimationSprite])[0]
    this.changeState.addObserver(x => this.animation.changeTo(x))
    this.changeIsVisible.addObserver(x => this.animation.setVisible(x))
  }

  set isVisible(value: boolean) {
    if (value != this._isVisible) {
      this._isVisible = value
      this.changeIsVisible.notify(value)
    }
  }

  get isVisible(): boolean {
    return this.isVisible
  }

  set state(value: string) {
    this._state = value
    this.changeState.notify(value)
  }

  get state(): string {
    return this._state
  }
}
