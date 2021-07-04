import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { KeyController } from '@game/systems/controlSystem'
import { Vec2 } from '@core/math/vec2'
import { World } from '@core/ecs/world'
import GravitySystem from '@game/systems/gravitySystem'
import { wait } from '@core/behaviour/wait'
import * as Sound from '@core/sound/sound'
import { JetEffectFactory } from '@game/entities/effect/jetEffectFactory'
import { PLAYER_SETTING } from '../playerAI'

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

const jetCondition = (entity: Entity): boolean => {
  const airHolder = entity.getComponent('AirHolder')
  return (
    KeyController.isActionPressing('Jet') &&
    airHolder.quantity >= PLAYER_SETTING.normal.jet.airConsumeSpeed
  )
}

export const jet = function*(entity: Entity, world: World): Behaviour<void> {
  const body = entity.getComponent('RigidBody')
  const airHolder = entity.getComponent('AirHolder')
  const animState = entity.getComponent('AnimationState')

  while (true) {
    while (!jetCondition(entity)) yield

    if (body.velocity.length() > PLAYER_SETTING.normal.jet.speed) {
      body.velocity.assign(body.velocity.normalize().mul(PLAYER_SETTING.normal.jet.speed))
    }

    while (jetCondition(entity)) {
      const playerAngle = calcPlayerAngle()
      const velocity = body.velocity
      const acceleration = body.acceleration

      animState.state = 'Jumping'
      acceleration.y -= GravitySystem.acceleration * body.gravityScale
      airHolder.consumeBy(PLAYER_SETTING.normal.jet.airConsumeSpeed)

      if (Math.random() < 0.5) {
        Sound.play('airJet', { volume: 0.5 })
        const jetEffectFactory = new JetEffectFactory(world)
        jetEffectFactory.setShooter(entity)
        const jetEffect = jetEffectFactory.create()
        const effectPosition = jetEffect.getComponent('Position')
        const offset = 12
        const dir = playerAngle.normalize().mul(-1)
        effectPosition.add(dir.mul(offset))

        world.addEntity(jetEffect)
      }

      if (playerAngle.lengthSq() > 0 && velocity.length() < PLAYER_SETTING.normal.jet.speed) {
        acceleration.x += playerAngle.x * PLAYER_SETTING.normal.jet.power
        acceleration.y += playerAngle.y * PLAYER_SETTING.normal.jet.power
      }

      yield
    }

    yield* wait(PLAYER_SETTING.normal.jet.coolTime)
  }
}
