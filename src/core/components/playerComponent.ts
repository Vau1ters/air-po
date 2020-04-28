import { EventNotifier } from '../eventNotifier'

export class PlayerComponent {
  private _state: PlayerState = 'Standing'
  public landing = false
  private _status: PlayerStatus

  public constructor(initialStatus: PlayerStatus) {
    this._status = initialStatus
  }

  public readonly changeState = new EventNotifier<PlayerState>()

  public get status(): PlayerStatus {
    return this._status
  }

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
export type PlayerStatus = {
  air: {
    consumeSpeed: number
    collectSpeed: number
  }
}
