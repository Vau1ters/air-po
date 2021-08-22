import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { animate } from '@game/ai/entity/common/action/animate'
import { kill } from '@game/ai/entity/common/action/kill'

export const effectAI = function*(entity: Entity, world: World): Behaviour<void> {
  yield* animate({ entity, state: 'Default' })
  yield* kill(entity, world)
}
