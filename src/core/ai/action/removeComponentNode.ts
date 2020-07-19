import { BehaviourNode, Behaviour } from '../behaviourNode'
import { Entity } from '../../ecs/entity'
import { ComponentName } from '../../ecs/component'

export class RemoveComponentNode extends BehaviourNode {
  private entity: Entity
  private componentName: ComponentName

  public constructor(entity: Entity, componentName: ComponentName) {
    super()
    this.entity = entity
    this.componentName = componentName
  }

  protected *behaviour(): Behaviour {
    this.entity.removeComponent(this.componentName)
    yield
    return 'Success'
  }
}
