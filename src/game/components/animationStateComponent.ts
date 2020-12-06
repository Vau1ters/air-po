import { Animation } from '@core/graphics/animation'
import { EventNotifier } from '@utils/eventNotifier'

export class AnimationStateComponent {
  private _state = ''
  private _isVisible = true

  public readonly changeState = new EventNotifier<string>()
  public readonly changeIsVisible = new EventNotifier<boolean>()

  constructor(public animation: Animation) {
    this.changeState.addObserver(x => animation.changeTo(x))
    this.changeIsVisible.addObserver(x => animation.setVisible(x))
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
