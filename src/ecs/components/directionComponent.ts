import { EventNotifier } from '../../utils/eventNotifier'

export class HorizontalDirectionComponent {
  private _looking: HorizontalDirection
  public constructor(looking: HorizontalDirection) {
    this._looking = looking
  }

  set looking(value: HorizontalDirection) {
    this._looking = value
    this.changeDirection.notify(this._looking)
  }

  get looking(): HorizontalDirection {
    return this._looking
  }

  public readonly changeDirection = new EventNotifier<HorizontalDirection>()
}

export type HorizontalDirection = 'Left' | 'Right'
