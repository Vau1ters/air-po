import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAll } from '@core/behaviour/composite'
import { animate } from '../../common/action/animate'
import { invincibleTime } from '../../common/action/invincibleTime'
import { gunShoot } from '../common/gunShoot'
import { jet } from './jet'
import { jump } from './jump'
import { land } from './land'
import { downThroughFloor } from './downThroughFloor'
import { walk } from './walk'
import { pickup } from './pickup'
import { talk } from './talk'

export const normalAI = function*(entity: Entity, world: World): Behaviour<void> {
  const playerBody = entity.getComponent('RigidBody')
  playerBody.gravityScale = 1 // to reset change of gravityScale by fluff

  yield* parallelAll([
    gunShoot(entity, world),
    jump(entity, world),
    downThroughFloor(entity),
    walk(entity),
    jet(entity, world),
    land(entity),
    pickup(entity),
    talk(entity, world),
    animate({ entity, loopCount: Infinity }),
    invincibleTime(entity),
  ])
}
