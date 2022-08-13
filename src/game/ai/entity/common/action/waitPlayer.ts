import { Entity } from '@core/ecs/entity'
import { Behaviour } from '@core/behaviour/behaviour'
import { wait } from '@core/behaviour/wait'

export const waitPlayer = function* (entity: Entity): Behaviour<void> {
  const [collider] = entity.getComponent('Collider').colliders
  while (true) {
    const collisionResults = yield* wait.collision(collider)
    if (collisionResults.find(r => r.other.tag.has('PlayerSensor'))) return
  }
}
