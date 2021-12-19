import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Behaviour } from '@core/behaviour/behaviour'
import { dandelionBehaviour } from './dandelion'
import { parallelAll } from '@core/behaviour/composite'
import { animate } from '../common/action/animate'

export const dandelionAI = function* (entity: Entity, world: World): Behaviour<void> {
  yield* parallelAll([
    dandelionBehaviour(entity, world),
    animate({ entity, state: 'Normal', loopCount: Infinity }),
  ])
}
