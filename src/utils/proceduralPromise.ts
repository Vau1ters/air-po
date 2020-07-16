type CallState = 'Pending' | 'Success' | 'Failure'

export class ProceduralPromise<T> {
  private _promise: Promise<T>
  private _resolve: (arg: T) => void = () => {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _reject: (reason: any) => void = () => {}
  private _state: CallState = 'Pending'

  public constructor() {
    this._promise = new Promise((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject
    })
  }

  public get promise(): Promise<T> {
    return this._promise
  }

  public resolve(arg: T): void {
    if (this.state === 'Pending') {
      this._resolve(arg)
      this._state = 'Success'
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public reject(reason: any): void {
    if (this.state === 'Pending') {
      this._reject(reason)
      this._state = 'Failure'
    }
  }

  public get state(): CallState {
    return this._state
  }
}
