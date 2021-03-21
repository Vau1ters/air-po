import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { KeyController } from '@game/systems/controlSystem'
import * as Sound from '@core/sound/sound'
import { parallelAll } from '@core/behaviour/composite'

const SETTING = {
  WALK_POWER: 600,
  JUMP_SPEED: 360,
  THROUGH_FLOOR_IGNORE_COUNT: 20,
}

const playerJump = function*(entity: Entity): Behaviour<void> {
  const player = entity.getComponent('Player')
  const animState = entity.getComponent('AnimationState')

  const body = entity.getComponent('RigidBody')

  while (true) {
    while (!player.landing) yield

    animState.state = 'Standing'
    Sound.play('foot')

    while (player.landing) {
      if (KeyController.isActionPressing('Jump')) {
        body.velocity.y = -SETTING.JUMP_SPEED
        Sound.play('jump')
      }

      yield
    }

    animState.state = 'Jumping'
  }
}

const playerWalk = function*(entity: Entity): Behaviour<void> {
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
        if (body.velocity.x < 100) body.acceleration.x += SETTING.WALK_POWER
        if (player.landing) animState.state = 'Walking'
        direction.looking = 'Right'
      }
      if (KeyController.isActionPressing('MoveLeft')) {
        if (body.velocity.x > -100) body.acceleration.x -= SETTING.WALK_POWER
        if (player.landing) animState.state = 'Walking'
        direction.looking = 'Left'
      }

      yield
    }

    if (body.velocity.x > 0) body.acceleration.x -= SETTING.WALK_POWER
    if (body.velocity.x < 0) body.acceleration.x += SETTING.WALK_POWER
    if (player.landing) animState.state = 'Standing'
    yield
  }
}

const playerThroughWall = function*(entity: Entity): Behaviour<void> {
  const player = entity.getComponent('Player')

  while (true) {
    if (player.landing && KeyController.isActionPressing('MoveDown')) {
      player.throughFloorIgnoreCount = SETTING.THROUGH_FLOOR_IGNORE_COUNT
    }
    if (player.throughFloorIgnoreCount > 0) {
      player.throughFloorIgnoreCount--
    }
    yield
  }
}

const playerResetState = function*(entity: Entity): Behaviour<void> {
  const player = entity.getComponent('Player')

  while (true) {
    player.landing = false
    yield
  }
}

export const playerMove = function*(entity: Entity): Behaviour<void> {
  yield* parallelAll([
    playerJump(entity),
    playerWalk(entity),
    playerThroughWall(entity),
    playerResetState(entity),
  ])
}
