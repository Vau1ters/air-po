import { ExecuteResult } from '../behaviour'
import { CompositeNode } from './compositeNode'

export class SequenceNode extends CompositeNode {
  protected async behaviour(): Promise<ExecuteResult> {
    for (const node of this.children) {
      const result = await node.execute()
      // 一つでも失敗したら、失敗状態として強制終了
      if (result === 'Failure') {
        this.terminate('Failure')
        return 'Failure'
      }
    }
    return 'Success'
  }
}
