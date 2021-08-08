import { Behaviour } from '@core/behaviour/behaviour'
import { ease } from '@core/behaviour/easing/easing'
import { In } from '@core/behaviour/easing/functions'
import { wait } from '@core/behaviour/wait'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { kill } from '../common/action/kill'

export const poisonAI = function*(entity: Entity, world: World): Behaviour<void> {
  const draw = entity.getComponent('Draw')
  yield* wait(120)
  yield* ease(In.quad)(
    60,
    x => {
      draw.alpha = x
    },
    { from: 1, to: 0 }
  )
  yield* kill(entity, world)
}
