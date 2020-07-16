import { Entity } from '../../ecs/entity'
import { ComponentName } from '../../ecs/component'
import { BehaviourNode, ExecuteResult } from '../behaviour'

export class RemoveComponentNode extends BehaviourNode {
  private entity: Entity
  private componentName: ComponentName

  public constructor(entity: Entity, componentName: ComponentName) {
    super()
    this.entity = entity
    this.componentName = componentName
  }

  protected async behaviour(): Promise<ExecuteResult> {
    this.entity.removeComponent(this.componentName)
    return 'Success'
  }
}
