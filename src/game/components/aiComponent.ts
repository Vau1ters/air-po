import { Behaviour } from '@core/behaviour/behaviour'
import { Process } from '@utils/proc'

export class AIComponent {
  public readonly proc: Process

  public constructor(
    arg: Behaviour<void> | { behaviour: Behaviour<void>; name?: string; dependencies?: string[] }
  ) {
    if ('behaviour' in arg) {
      const { behaviour, name, dependencies } = arg as {
        behaviour: Behaviour<void>
        name: string
        dependencies?: string[]
      }
      this.proc = new Process(() => behaviour.next(), name, dependencies ?? [])
    } else {
      this.proc = new Process(() => arg.next(), '')
    }
  }
}
