import { BehaviourNode, ExecuteResult } from '../behaviourNode'

export class WaitNode extends BehaviourNode {
  public constructor(private duration: number) {
    super()
  }

  protected *behaviour(): Generator<void, ExecuteResult> {
    for (let time = 0; time < this.duration; time++) {
      yield
    }
    return 'Success'
  }
}
