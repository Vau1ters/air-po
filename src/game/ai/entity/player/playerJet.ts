import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { KeyController } from '@game/systems/controlSystem'
import { Vec2 } from '@core/math/vec2'
import { World } from '@core/ecs/world'
import { JetEffectFactory } from '@game/entities/jetEffectFactory'
import GravitySystem from '@game/systems/gravitySystem'

const SETTING = {
  CONSUME_SPEED: 0.1,
  JET_SPEED: 140,
  JET_POWER: 600,
}
const calcPlayerAngle = (): Vec2 => {
  const angle = new Vec2()

  if (KeyController.isActionPressing('MoveLeft')) {
    angle.x -= 1
  }
  if (KeyController.isActionPressing('MoveRight')) {
    angle.x += 1
  }
  if (KeyController.isActionPressing('MoveUp')) {
    angle.y -= 1
  }
  if (KeyController.isActionPressing('MoveDown')) {
    angle.y += 1
  }

  return angle.normalize()
}

export const playerJet = function*(entity: Entity, world: World): Behaviour<void> {
  const body = entity.getComponent('RigidBody')
  const airHolder = entity.getComponent('AirHolder')
  const animState = entity.getComponent('AnimationState')

  while (true) {
    while (!KeyController.isActionPressing('Jet')) yield

    if (body.velocity.length() > SETTING.JET_SPEED) {
      body.velocity.assign(body.velocity.normalize().mul(SETTING.JET_SPEED))
    }

    while (KeyController.isActionPressing('Jet')) {
      const playerAngle = calcPlayerAngle()
      const velocity = body.velocity
      const acceleration = body.acceleration

      animState.state = 'Jumping'
      acceleration.y -= GravitySystem.acceleration * body.gravityScale
      airHolder.consumeBy(SETTING.CONSUME_SPEED)

      if (Math.random() < 0.5) {
        const jetEffectFactory = new JetEffectFactory(world)
        jetEffectFactory.setShooter(entity)
        const jetEffect = jetEffectFactory.create()
        const effectPosition = jetEffect.getComponent('Position')
        const offset = 12
        const dir = playerAngle.normalize().mul(-1)
        effectPosition.add(dir.mul(offset))

        world.addEntity(jetEffect)
      }

      if (
        playerAngle.lengthSq() > 0 &&
        airHolder.quantity >= SETTING.CONSUME_SPEED &&
        velocity.length() < SETTING.JET_SPEED
      ) {
        acceleration.x += playerAngle.x * SETTING.JET_POWER
        acceleration.y += playerAngle.y * SETTING.JET_POWER
      }

      yield
    }

    yield
  }
}
