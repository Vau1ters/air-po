import { EventNotifier } from '../eventNotifier'

export class AnimationStateComponent {
  private _state = ''
  public readonly changeState = new EventNotifier<string>()

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
