import { Behaviour } from '../behaviourNode'
import { CompositeNode } from './compositeNode'

export class ParallelNode extends CompositeNode {
  protected *behaviour(): Behaviour {
    // 全部完了していたら終了
    while (true) {
      for (const node of this.children) {
        const nodeState = node.execute()
        if (nodeState === 'Failure') {
          return 'Failure'
        }
      }
      if (!this.children.every(node => node.hasDone)) {
        return 'Success'
      }
      yield
    }
  }
}
