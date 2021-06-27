import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { KeyController } from '@game/systems/controlSystem'
import { PLAYER_SETTING } from '../playerAI'

export const walk = function*(entity: Entity): Behaviour<void> {
  const player = entity.getComponent('Player')
  const animState = entity.getComponent('AnimationState')
  const direction = entity.getComponent('HorizontalDirection')

  const body = entity.getComponent('RigidBody')

  while (true) {
    while (
      KeyController.isActionPressing('MoveRight') ||
      KeyController.isActionPressing('MoveLeft')
    ) {
      if (KeyController.isActionPressing('MoveRight')) {
        body.velocity.x = Math.min(
          body.velocity.x + PLAYER_SETTING.normal.walk.power,
          PLAYER_SETTING.normal.walk.speed
        )
        if (player.landing) animState.state = 'Walking'
        direction.looking = 'Right'
      }
      if (KeyController.isActionPressing('MoveLeft')) {
        body.velocity.x = Math.max(
          body.velocity.x - PLAYER_SETTING.normal.walk.power,
          -PLAYER_SETTING.normal.walk.speed
        )
        if (player.landing) animState.state = 'Walking'
        direction.looking = 'Left'
      }

      yield
    }

    if (body.velocity.x > 0) {
      body.velocity.x = Math.max(body.velocity.x - PLAYER_SETTING.normal.walk.power, 0)
    } else if (body.velocity.x < 0) {
      body.velocity.x = Math.min(body.velocity.x + PLAYER_SETTING.normal.walk.power, 0)
    }

    if (player.landing) animState.state = 'Standing'
    yield
  }
}
