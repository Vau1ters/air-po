import { Behaviour, BehaviourNode } from '../behaviourNode'
import { Entity } from '../../ecs/entity'
import { World } from '../../ecs/world'

export const trueNode = function*(): Behaviour {
  return 'Success'
}

export const falseNode = function*(): Behaviour {
  return 'Failure'
}

export const notNode = (boolNode: BehaviourNode) =>
  function*(entity: Entity, world: World): Behaviour {
    const result = yield* boolNode(entity, world)
    if (result === 'Success') return 'Failure'
    return 'Success'
  }
