import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { animate } from '@game/ai/entity/common/action/animate'
import { kill } from '@game/ai/entity/common/action/kill'

export const LandingEffectAI = function*(entity: Entity, world: World): Behaviour<void> {
  // const pos = entity.getComponent('Position')
  // const draw = entity.getComponent('Draw')
  yield* animate({ entity, state: 'Default', waitFrames: 5 })
  yield* kill(entity, world)
}
