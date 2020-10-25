import { Behaviour } from '../../../behaviour'
import { Entity } from '../../../../ecs/entity'
import { ComponentName } from '../../../../ecs/component'

export const removeComponentNode = function*(
  entity: Entity,
  componentName: ComponentName
): Behaviour<void> {
  entity.removeComponent(componentName)
}
