import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { Process } from '@core/process/process'
import { ProcessDependency } from '@core/process/processDependency'

export class AiComponent {
  public readonly proc: Process
  private _isAlive = true

  public constructor(
    entity: Entity,
    arg: Behaviour<void> | { behaviour: Behaviour<void>; dependency: ProcessDependency }
  ) {
    const name = entity.hasComponent('Name') ? entity.getComponent('Name').name : ''
    if ('behaviour' in arg) {
      const { behaviour, dependency } = arg as {
        behaviour: Behaviour<void>
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
        name,
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
