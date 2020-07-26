import { BehaviourNode, Behaviour } from '../behaviourNode'
import { Entity } from '../../ecs/entity'
import { World } from '../../ecs/world'

export const whileNode = (conditionNode: BehaviourNode, executionNode: BehaviourNode) =>
  function*(entity: Entity, world: World): Behaviour {
    let behaviour = executionNode(entity, world)
    while (true) {
      const condition = yield* conditionNode(entity, world)
      if (condition === 'Failure') break

      const result = behaviour.next()
      if (result.done) {
        behaviour = executionNode(entity, world)
      }
      yield
    }
    return 'Success'
  }
