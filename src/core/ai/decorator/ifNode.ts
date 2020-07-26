import { Behaviour, BehaviourNode } from '../behaviourNode'
import { Entity } from '../../ecs/entity'
import { World } from '../../ecs/world'

export const ifNode = (
  condNode: BehaviourNode,
  thenNode: BehaviourNode,
  elseNode?: BehaviourNode
) =>
  function*(entity: Entity, world: World): Behaviour {
    const condition = yield* condNode(entity, world)
    if (condition === 'Success') {
      return yield* thenNode(entity, world)
    } else if (elseNode !== undefined) {
      return yield* elseNode(entity, world)
    }
    return 'Failure'
  }
