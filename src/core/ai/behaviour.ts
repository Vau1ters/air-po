import { ProceduralPromise } from '../../utils/proceduralPromise'

export type ExecuteResult = 'Success' | 'Failure'
export type ExecuteState = ExecuteResult | 'Pending' | 'Running'

export abstract class BehaviourNode {
  private _promise: ProceduralPromise<ExecuteResult> = new ProceduralPromise()
  private _currentState: ExecuteState = 'Pending'

  protected abstract async behaviour(): Promise<ExecuteResult>

  public async execute(): Promise<ExecuteResult> {
    if (this.currentState === 'Running') throw new Error('This behaviour node has already running.')
    this._currentState = 'Running'
    // 外から強制終了できるようにするためにラップしておく
    this.behaviour().then(result => this._promise.resolve(result))
    this._currentState = await this._promise.promise
    return this._currentState
  }

  public get currentState(): ExecuteState {
    return this._currentState
  }

  // 任意の状態で強制終了
  // 必要に応じて終了処理の実装を追加する
  public terminate(result: ExecuteResult): void {
    if (this.currentState === 'Running') {
      this._promise.resolve(result)
    }
  }
}
