import { Entity } from '@core/ecs/entity'
import { Behaviour } from '@core/behaviour/behaviour'

export const damageEffect = function*(entity: Entity): Behaviour<void> {
  while (true) {
    const hp = entity.getComponent('HP')
    if (hp.damageTime > 0) {
      entity.getComponent('Draw').filters[0].uniforms.damaging = true
      hp.damageTime--
    } else {
      entity.getComponent('Draw').filters[0].uniforms.damaging = false
    }
    yield
  }
}
