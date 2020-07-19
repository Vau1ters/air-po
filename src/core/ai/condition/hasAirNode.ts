import { BehaviourNode, Behaviour } from '../behaviourNode'
import { Entity } from '../../ecs/entity'

export class HasAirNode extends BehaviourNode {
  private entity: Entity

  public constructor(entity: Entity) {
    super()
    this.entity = entity
  }

  protected *behaviour(): Behaviour {
    yield
    if (this.entity.hasComponent('AirHolder')) {
      const holder = this.entity.getComponent('AirHolder')
      if (holder.currentQuantity > 0) {
        return 'Success'
      } else {
        return 'Failure'
      }
    }
    return 'Failure'
  }
}
