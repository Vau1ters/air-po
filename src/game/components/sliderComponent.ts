import { EventNotifier } from '@utils/eventNotifier'

export class SliderComponent {
  private readonly onValueChanged = new EventNotifier<number>()
  private currentValue = 0

  public set value(value: number) {
    if (this.currentValue === value) return
    this.currentValue = value
    this.onValueChanged.notify(value)
  }

  public addCallback(cb: (value: number) => void): void {
    this.onValueChanged.addObserver(cb)
    this.onValueChanged.notify(this.currentValue)
  }
}
