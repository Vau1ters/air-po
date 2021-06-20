import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { SporeEffectBehaviour } from './sporeEffect'

export const SporeEffectAI = function*(entity: Entity, world: World): Behaviour<void> {
  yield* SporeEffectBehaviour(entity, world)
}
