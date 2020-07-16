import { BehaviourNode, ExecuteResult } from '../behaviour'
import Timer from '../../../utils/timer'

export class WaitNode extends BehaviourNode {
  private timer: Timer

  public constructor(time = 0) {
    super()
    this.timer = new Timer(time)
  }

  protected async behaviour(): Promise<ExecuteResult> {
    this.timer.start()
    await this.timer.end
    return 'Success'
  }

  public terminate(result: ExecuteResult): void {
    super.terminate(result)
    this.timer.terminate()
  }
}
