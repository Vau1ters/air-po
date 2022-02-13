import { EventNotifier } from '@utils/eventNotifier'

export class CheckboxComponent {
  private readonly onValueChanged = new EventNotifier<boolean>()
  private currentValue: boolean

  constructor(initialValue: boolean) {
    this.currentValue = initialValue
  }

  public get value() {
    return this.currentValue
  }

  public set value(value: boolean) {
    if (this.currentValue === value) return
    this.currentValue = value
    this.onValueChanged.notify(value)
  }

  public addCallback(cb: (value: boolean) => void): void {
    this.onValueChanged.addObserver(cb)
    this.onValueChanged.notify(this.currentValue)
  }
}
