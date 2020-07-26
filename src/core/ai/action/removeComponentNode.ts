import { Behaviour } from '../behaviourNode'
import { Entity } from '../../ecs/entity'
import { ComponentName } from '../../ecs/component'

export const removeComponentNode = (componentName: ComponentName) =>
  function*(entity: Entity): Behaviour {
    entity.removeComponent(componentName)
    return 'Success'
  }
