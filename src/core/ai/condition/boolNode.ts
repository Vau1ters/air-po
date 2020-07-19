import { BehaviourNode, Behaviour } from '../behaviourNode'

export class TrueNode extends BehaviourNode {
  protected *behaviour(): Behaviour {
    yield
    return 'Success'
  }
}

export class FalseNode extends BehaviourNode {
  protected *behaviour(): Behaviour {
    yield
    return 'Failure'
  }
}
