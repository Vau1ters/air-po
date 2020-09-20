import { Entity } from '../../ecs/entity'
import { Behaviour } from '../behaviour'

const duration = 0.15

export const invincibleTime = function*(entity: Entity): Behaviour<void> {
  const invincible = entity.getComponent('Invincible')
  if (invincible.isInvincible()) {
    const t = invincible.getTime()
    entity.getComponent('AnimationState').isVisible = t % duration < duration / 2
  } else {
    entity.getComponent('AnimationState').isVisible = true
  }
  yield
}
