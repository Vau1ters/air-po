import { Behaviour } from '@core/behaviour/behaviour'
import { wait } from '@core/behaviour/wait'
import { Entity } from '@core/ecs/entity'
import { PLAYER_SENSOR_TAG } from '@game/entities/playerFactory'
import { KeyController } from '@game/systems/controlSystem'
import { assert } from '@utils/assertion'

export const pickup = function* (entity: Entity): Behaviour<void> {
  const player = entity.getComponent('Player')

  const sensorCollider = entity
    .getComponent('Collider')
    .colliders.find(c => c.hasTag(PLAYER_SENSOR_TAG))
  assert(sensorCollider !== undefined, '')

  while (true) {
    const collisionResults = yield* wait.collision(sensorCollider)
    const pickupTarget = collisionResults
      .map(r => r.other.entity)
      .filter(other => other.hasComponent('PickupTarget'))
    if (KeyController.isKeyPressed('E')) {
      if (player.possessingEntity !== undefined) {
        const target = player.possessingEntity.getComponent('PickupTarget')
        target.isPossessed = false
        player.possessingEntity = undefined
      } else if (pickupTarget.length > 0) {
        const targetEntity = Array.from(pickupTarget.values())[0]
        const target = targetEntity.getComponent('PickupTarget')
        target.isPossessed = true
        player.possessingEntity = targetEntity
        entity.getComponent('Sound').addSound('grab')
      }
    }
  }
}
