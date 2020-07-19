import { Behaviour } from '../behaviourNode'
import { CompositeNode } from './compositeNode'

export class SelectNode extends CompositeNode {
  protected *behaviour(): Behaviour {
    for (const node of this.children) {
      const result = yield* node.iterator
      if (result === 'Success') {
        return 'Success'
      }
    }
    return 'Failure'
  }
}
