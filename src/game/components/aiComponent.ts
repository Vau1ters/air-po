import { Behaviour } from '@core/behaviour/behaviour'
import { Dependency, Process } from '@utils/proc'

export class AiComponent {
  public readonly proc: Process

  public constructor(
    arg: Behaviour<void> | { behaviour: Behaviour<void>; name?: string; dependency: Dependency }
  ) {
    if ('behaviour' in arg) {
      const { behaviour, name, dependency } = arg as {
        behaviour: Behaviour<void>
        name: string
        dependency: Dependency
      }
      this.proc = new Process(() => behaviour.next(), name, dependency)
    } else {
      this.proc = new Process(() => arg.next(), '')
    }
  }
}
