import { Behaviour } from '../ai/behaviour'

export class AIComponent {
  private root: Behaviour<void>

  public constructor(root: Behaviour<void>) {
    this.root = root
  }

  public execute(): void {
    this.root.next()
  }
}
