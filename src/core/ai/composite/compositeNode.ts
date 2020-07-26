import { BehaviourNode, Behaviour } from '../behaviourNode'
import { Entity } from '../../ecs/entity'
import { World } from '../../ecs/world'

export const parallelNode = (nodes: Array<BehaviourNode>) =>
  function*(entity: Entity, world: World): Behaviour {
    const behaviourList = nodes.map(node => node(entity, world))
    while (true) {
      let hasAllDone = true
      for (const behaviour of behaviourList) {
        const result = behaviour.next()
        hasAllDone = hasAllDone && !!result.done
        if (result.value === 'Failure') {
          return 'Failure'
        }
      }
      if (hasAllDone) {
        return 'Success'
      }
    }
  }

export const selectNode = (nodes: Array<BehaviourNode>) =>
  function*(entity: Entity, world: World): Behaviour {
    const behaviourList = nodes.map(node => node(entity, world))
    for (const behaviour of behaviourList) {
      const result = yield* behaviour
      if (result === 'Success') {
        return 'Success'
      }
    }
    return 'Failure'
  }

export const sequenceNode = (nodes: Array<BehaviourNode>) =>
  function*(entity: Entity, world: World): Behaviour {
    const behaviourList = nodes.map(node => node(entity, world))
    for (const behaviour of behaviourList) {
      const result = yield* behaviour
      if (result === 'Failure') {
        return 'Failure'
      }
    }
    return 'Success'
  }
