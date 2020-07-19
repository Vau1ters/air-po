import { BehaviourNode, Behaviour } from '../behaviourNode'
import { Entity } from '../../ecs/entity'

export class IsDeadNode extends BehaviourNode {
  private entity: Entity

  public constructor(entity: Entity) {
    super()
    this.entity = entity
  }

  protected *behaviour(): Behaviour {
    yield
    if (this.entity.hasComponent('HP')) {
      const hp = this.entity.getComponent('HP')
      if (hp.hp <= 0) {
        return 'Success'
      } else {
        return 'Failure'
      }
    }
    return 'Failure'
  }
}
