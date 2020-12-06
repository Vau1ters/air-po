import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { KeyController } from '@game/systems/controlSystem'
import { Vec2 } from '@core/math/vec2'
import { World } from '@core/ecs/world'
import { JetEffectFactory } from '@game/entities/jetEffectFactory'
import { normalize } from '*.png'

const SETTING = {
  CONSUME_SPEED: 1,
  JET_SPEED: 180,
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
  const velocity = body.velocity

  while (true) {
    const playerAngle = calcPlayerAngle()
    if (
      KeyController.isActionPressing('Jet') &&
      playerAngle.lengthSq() > 0 &&
      airHolder.currentQuantity >= SETTING.CONSUME_SPEED
    ) {
      velocity.x = playerAngle.x * SETTING.JET_SPEED
      velocity.y = playerAngle.y * SETTING.JET_SPEED
      airHolder.consumeBy(SETTING.CONSUME_SPEED)

      if (Math.random() < 0.5) {
        const jetEffectFactory = new JetEffectFactory(world)
        jetEffectFactory.setShooter(entity, 'player')
        const jetEffect = jetEffectFactory.create()
        const effectPosition = jetEffect.getComponent('Position')
        const offset = 12
        const dir = playerAngle.normalize().mul(-1)
        effectPosition.add(dir.mul(offset))

        world.addEntity(jetEffect)
      }
    }

    yield
  }
}
