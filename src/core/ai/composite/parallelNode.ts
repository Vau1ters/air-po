import { BehaviourNode, ExecuteResult } from '../behaviour'
import { CompositeNode } from './compositeNode'

export class ParallelNode extends CompositeNode {
  protected async behaviour(): Promise<ExecuteResult> {
    try {
      await Promise.all(this.children.map(node => this.promiseWrapper(node)))
    } catch {
      // 一つでも失敗したらすべてを強制終了して、ParallelNodeも失敗状態にする
      this.terminate('Failure')
      return 'Failure'
    }
    return 'Success'
  }

  // 失敗したときにPromise.allから抜け出せるラッパー
  private async promiseWrapper(node: BehaviourNode): Promise<ExecuteResult> {
    const result = await node.execute()
    if (result === 'Failure') {
      throw new Error()
    }
    return result
  }
}
