import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { KeyController } from '@game/systems/controlSystem'
import { PLAYER_SETTING } from '../playerAI'

export const jump = function*(entity: Entity): Behaviour<void> {
  const player = entity.getComponent('Player')
  const animState = entity.getComponent('AnimationState')

  const body = entity.getComponent('RigidBody')

  while (true) {
    while (!player.landing) yield

    animState.state = 'Standing'
    entity.getComponent('Sound').addSound('playerLanding')

    while (player.landing) {
      if (KeyController.isActionPressing('Jump')) {
        body.velocity.y = -PLAYER_SETTING.normal.jump.speed
        entity.getComponent('Sound').addSound('playerJump')
      }

      yield
    }

    animState.state = 'Jumping'
  }
}
