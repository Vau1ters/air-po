import { Behaviour } from '../behaviourNode'
import { Entity } from '../../ecs/entity'

export const hasAirNode = function*(entity: Entity): Behaviour {
  if (!entity.hasComponent('AirHolder')) return 'Failure'
  const airHolderComponent = entity.getComponent('AirHolder')
  if (airHolderComponent.currentQuantity <= 0) {
    return 'Failure'
  }
  return 'Success'
}
