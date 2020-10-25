import { Behaviour } from '../../../../core/behaviour/behaviour'
import { Entity } from '../../../../core/ecs/entity'
import { KeyController } from '@game/systems/controlSystem'
import * as Sound from '../../../../core/sound/sound'

export const playerMove = function*(entity: Entity): Behaviour<void> {
  const player = entity.getComponent('Player')
  const animState = entity.getComponent('AnimationState')
  const direction = entity.getComponent('HorizontalDirection')

  const body = entity.getComponent('RigidBody')

  const velocity = body.velocity

  let isLandingPrevFrame = player.landing

  while (true) {
    if (KeyController.isActionPressing('MoveRight')) {
      if (velocity.x < 100) velocity.x += 10
      if (player.landing) animState.state = 'Walking'
      direction.looking = 'Right'
    } else if (KeyController.isActionPressing('MoveLeft')) {
      if (velocity.x > -100) velocity.x -= 10
      if (player.landing) animState.state = 'Walking'
      direction.looking = 'Left'
    } else {
      if (velocity.x > 0) velocity.x -= Math.min(20, velocity.x)
      if (velocity.x < 0) velocity.x -= Math.max(-20, velocity.x)
      if (player.landing) animState.state = 'Standing'
    }
    if (player.landing) {
      if (!isLandingPrevFrame) Sound.play('foot')
      velocity.y = 0
    }
    if (KeyController.isActionPressing('Jump') && player.landing) {
      velocity.y = -250
      animState.state = 'Jumping'
      Sound.play('jump')
    }
    isLandingPrevFrame = player.landing
    player.landing = false

    yield
  }
}
