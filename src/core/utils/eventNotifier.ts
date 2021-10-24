export class EventNotifier<T> {
  private callbacks: Set<(arg: T) => void>

  public constructor() {
    this.callbacks = new Set()
  }

  public addObserver(callback: (arg: T) => void): void {
    this.callbacks.add(callback)
  }

  public removeObserver(callback: (arg: T) => void): void {
    this.callbacks.delete(callback)
  }

  public clearObserver(): void {
    this.callbacks.clear()
  }

  public notify(arg: T): void {
    this.callbacks.forEach((callback): void => {
      callback(arg)
    })
  }

  public map<S>(conv: (t: T) => S): EventNotifier<S> {
    const result = new EventNotifier<S>()
    this.addObserver((arg: T): void => {
      result.notify(conv(arg))
    })
    return result
  }
}
