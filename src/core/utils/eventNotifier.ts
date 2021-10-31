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

  public map<S>(pred: (t: T) => S): EventNotifier<S> {
    const result = new EventNotifier<S>()
    this.addObserver((arg: T): void => {
      result.notify(pred(arg))
    })
    return result
  }

  public filter(pred: (t: T) => boolean): EventNotifier<T> {
    const result = new EventNotifier<T>()
    this.addObserver((arg: T): void => {
      if (pred(arg)) result.notify(arg)
    })
    return result
  }
}
