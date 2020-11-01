import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { ComponentName } from '@core/ecs/component'

export const removeComponentNode = function*(
  entity: Entity,
  componentName: ComponentName
): Behaviour<void> {
  entity.removeComponent(componentName)
}
