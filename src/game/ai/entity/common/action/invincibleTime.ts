import { Entity } from '../../../../../core/ecs/entity'
import { Behaviour } from '../../../../../core/behaviour/behaviour'

const duration = 0.15

export const invincibleTime = function*(entity: Entity): Behaviour<void> {
  while (true) {
    const invincible = entity.getComponent('Invincible')
    if (invincible.isInvincible()) {
      const t = invincible.getTime()
      entity.getComponent('AnimationState').isVisible = t % duration < duration / 2
    } else {
      entity.getComponent('AnimationState').isVisible = true
    }
    yield
  }
}
