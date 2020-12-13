import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Behaviour } from '@core/behaviour/behaviour'
import { kill } from '../common/action/kill'
import { ease } from '@core/behaviour/easing/easing'
import { Out } from '@core/behaviour/easing/functions'

const SETTING = {
  FLAME_LIFE: 60,
  AIR_RESISTANCE: 3.0,
  INITIAL_SIZE: 2,
  MAX_SIZE: 16,
}

export const flameAI = function*(entity: Entity, world: World): Behaviour<void> {
  const flameComponent = entity.getComponent('Flame')
  const rigidBody = entity.getComponent('RigidBody')

  yield* ease(Out.quad)(
    SETTING.FLAME_LIFE,
    (value: number) => {
      flameComponent.size = value
      rigidBody.acceleration = rigidBody.velocity.mul(-SETTING.AIR_RESISTANCE)
    },
    { from: SETTING.INITIAL_SIZE, to: SETTING.MAX_SIZE }
  )
  yield* kill(entity, world)
}
