import { EventNotifier } from '../eventNotifier'

export class PlayerComponent {
  private _state: PlayerState = 'Standing'
  public landing = false
  public bulletAngle = 0

  public readonly changeState = new EventNotifier<PlayerState>()

  set state(value: PlayerState) {
    if (value != this._state) {
      this._state = value
      this.changeState.notify(value)
    }
  }

  get state(): PlayerState {
    return this._state
  }
}

export type PlayerState = 'Jumping' | 'Standing' | 'Walking'
