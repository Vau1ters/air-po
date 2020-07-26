import { Behaviour } from '../ai/behaviourNode'

export class AIComponent {
  private root: Behaviour

  public constructor(root: Behaviour) {
    this.root = root
  }

  public execute(): void {
    this.root.next()
  }
}
