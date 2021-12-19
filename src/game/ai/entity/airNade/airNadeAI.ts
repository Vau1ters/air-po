import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { assert } from '@utils/assertion'
import { getCollisionResult } from '../common/action/collision'
import { emitAir } from '../common/action/emitAir'
import { kill } from '../common/action/kill'

export const AIR_NADE_VELOCITY = 220
export const AIR_NADE_LIFE = 60

const waitForCollision = function* (entity: Entity): Behaviour<void> {
  const collider = entity.getComponent('Collider').getByCategory('bullet')
  assert(collider !== undefined, 'collider not found')

  for (let i = 0; i < AIR_NADE_LIFE; i++) {
    const collisionResult = yield* getCollisionResult(collider)
    if (collisionResult.find(args => !args.other.entity.hasComponent('Player'))) {
      return
    }
  }
}

export const airNadeAI = function* (
  entity: Entity,
  playerEntity: Entity,
  world: World
): Behaviour<void> {
  const pos = entity.getComponent('Position')
  const rigidBody = entity.getComponent('RigidBody')

  const player = playerEntity.getComponent('Player')
  const playerPos = playerEntity.getComponent('Position')

  const dir = player.targetPosition.sub(playerPos).normalize()
  pos.assign(playerPos)
  rigidBody.velocity = dir.mul(AIR_NADE_VELOCITY)

  yield* waitForCollision(entity)
  yield* emitAir(entity)
  yield* kill(entity, world)
}
