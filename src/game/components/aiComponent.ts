import { Behaviour } from '@core/behaviour/behaviour'
import { Process } from '@core/process/process'
import { ProcessDependency } from '@core/process/processDependency'

export class AiComponent {
  public readonly proc: Process
  private _isAlive = true

  public constructor(
    arg:
      | Behaviour<void>
      | { behaviour: Behaviour<void>; name?: string; dependency: ProcessDependency }
  ) {
    if ('behaviour' in arg) {
      const { behaviour, name, dependency } = arg as {
        behaviour: Behaviour<void>
        name: string
        dependency: ProcessDependency
      }
      this.proc = new Process({
        func: () => this.step(behaviour),
        name,
        dependency,
        tag: new Set<string>(),
      })
    } else {
      this.proc = new Process({
        func: () => this.step(arg),
        tag: new Set<string>(),
      })
    }
    this.proc.tag?.add('AI')
  }

  private step(behaviour: Behaviour<void>): void {
    if (!this.isAlive) return
    const { done } = behaviour.next()
    this._isAlive = !done
  }

  public get isAlive(): boolean {
    return this._isAlive
  }
}
