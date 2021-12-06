import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { assert } from '@utils/assertion'
import { getCollisionResult } from '../common/action/collision'
import { emitAir } from '../common/action/emitAir'
import { kill } from '../common/action/kill'

const waitForCollision = function*(entity: Entity): Behaviour<void> {
  const collider = entity.getComponent('Collider').getByCategory('bullet')
  assert(collider !== undefined, 'collider not found')

  while (true) {
    const collisionResult = yield* getCollisionResult(collider)
    if (collisionResult.find(args => !args.other.entity.hasComponent('Player'))) {
      return
    }
  }
}

export const airNadeAI = function*(entity: Entity, world: World): Behaviour<void> {
  yield* waitForCollision(entity)
  yield* emitAir(entity)
  yield* kill(entity, world)
}
