import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { CollisionCallbackArgs } from '@game/components/colliderComponent'
import { PLAYER_SENSOR_TAG } from '@game/entities/playerFactory'
import { KeyController } from '@game/systems/controlSystem'

export const pickup = function*(entity: Entity): Behaviour<void> {
  const player = entity.getComponent('Player')
  const pickupTarget = new Set<Entity>()

  const sensorCollider = entity
    .getComponent('Collider')
    .colliders.find(c => c.tag.has(PLAYER_SENSOR_TAG))
  sensorCollider?.callbacks.add((args: CollisionCallbackArgs): void => {
    const {
      other: { entity: other },
    } = args
    if (other.hasComponent('PickupTarget')) {
      pickupTarget.add(other)
    }
  })

  while (true) {
    if (KeyController.isKeyPressed('E')) {
      if (player.possessingEntity !== undefined) {
        const target = player.possessingEntity.getComponent('PickupTarget')
        target.isPossessed = false
        player.possessingEntity = undefined
      } else if (pickupTarget.size > 0) {
        const targetEntity = Array.from(pickupTarget.values())[0]
        const target = targetEntity.getComponent('PickupTarget')
        target.isPossessed = true
        player.possessingEntity = targetEntity
        entity.getComponent('Sound').addSound('grab')
      }
    }
    pickupTarget.clear()
    yield
  }
}
