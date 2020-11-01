import { EventNotifier } from '@utils/eventNotifier'

export class AnimationStateComponent {
  private _state = ''
  private _isVisible = true

  public readonly changeState = new EventNotifier<string>()
  public readonly changeIsVisible = new EventNotifier<boolean>()

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
    if (value != this._state) {
      this._state = value
      this.changeState.notify(value)
    }
  }

  get state(): string {
    return this._state
  }
}
