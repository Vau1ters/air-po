import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { JumpingEffectFactory } from '@game/entities/effect/jumpingEffectFactory'
import { LandingEffectFactory } from '@game/entities/effect/landingEffectFactory'
import { KeyController } from '@game/systems/controlSystem'
import { PLAYER_SETTING } from '../playerAI'

export const jump = function* (entity: Entity, world: World): Behaviour<void> {
  const player = entity.getComponent('Player')
  const animState = entity.getComponent('AnimationState')

  const body = entity.getComponent('RigidBody')

  while (true) {
    while (!player.landing) yield

    const direction = entity.getComponent('HorizontalDirection')
    const landingEffectFactory = new LandingEffectFactory(world, direction).setPosition(
      entity.getComponent('Position').add(new Vec2(0, 4))
    )
    world.addEntity(landingEffectFactory.create())

    animState.state = 'Standing'
    entity.getComponent('Sound').addSound('playerLanding')

    while (player.landing) {
      if (KeyController.isActionPressing('Jump')) {
        body.velocity.y = -PLAYER_SETTING.normal.jump.speed
        entity.getComponent('Sound').addSound('playerJump')

        const direction = entity.getComponent('HorizontalDirection')
        const jumpingEffectFactory = new JumpingEffectFactory(world, direction).setPosition(
          entity.getComponent('Position').add(new Vec2(0, 4))
        )
        world.addEntity(jumpingEffectFactory.create())
      }

      yield
    }

    animState.state = 'Jumping'
  }
}
