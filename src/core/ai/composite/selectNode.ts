import { CompositeNode } from './compositeNode'
import { ExecuteResult } from '../behaviour'

export class SelectNode extends CompositeNode {
  protected async behaviour(): Promise<ExecuteResult> {
    for (const node of this.children) {
      const result = await node.execute()
      // 一つでも成功したら、成功状態として強制終了
      if (result === 'Success') {
        this.terminate('Success')
        return 'Success'
      }
    }
    return 'Success'
  }
}
