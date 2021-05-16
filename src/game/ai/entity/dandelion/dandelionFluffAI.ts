import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Behaviour } from '@core/behaviour/behaviour'
import { dandelionFluffBehaviour, dandelionAnimation } from './dandelionFluff'
import { parallelAll } from '@core/behaviour/composite'

export const dandelionFluffAI = function*(entity: Entity, world: World): Behaviour<void> {
  yield* parallelAll([dandelionFluffBehaviour(entity, world), dandelionAnimation(entity)])
}
