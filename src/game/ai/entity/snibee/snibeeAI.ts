import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Behaviour } from '@core/behaviour/behaviour'
import { suspendable } from '@core/behaviour/suspendable'
import { isAlive } from '@game/ai/entity/common/condition/isAlive'
import { kill } from '@game/ai/entity/common/action/kill'
import { emitAir } from '@game/ai/entity/common/action/emitAir'
import { FamilyBuilder } from '@core/ecs/family'
import { BulletFactory } from '@game/entities/bulletFactory'
import { wait } from '@core/behaviour/wait'
import { parallelAll } from '@core/behaviour/composite'
import { animate } from '@game/ai/entity/common/action/animate'
import { repeat } from '@core/behaviour/repeat'

export const SnibeeSetting = {
  interiorDistance: 80,
  exteriorDistance: 110,
  searchRange: 170,
  coolTime: 120,
  coolTimeRange: 30,
  angleRange: Math.PI / 6.0,
  maxVelocity: 200, // px/s
}

const moveAI = function*(entity: Entity, player: Entity): Behaviour<void> {
  const direction = entity.getComponent('HorizontalDirection')

  while (true) {
    const pp = player.getComponent('Position')
    const ep = entity.getComponent('Position')
    const rv = pp.sub(ep)
    const rb = entity.getComponent('RigidBody')
    const v = rb.velocity
    const a = rb.acceleration

    if (rv.length() < SnibeeSetting.searchRange) {
      if (rv.x === 0 && rv.y === 0) {
        // プレイヤーとの距離が0になったら動けなくなる可能背があるので緊急脱出
        v.x += (Math.random() - 0.5) * 10
        v.y += (Math.random() - 0.5) * 10
      } else if (rv.length() > SnibeeSetting.exteriorDistance) {
        a.x = rv.normalize().mul(SnibeeSetting.maxVelocity * rb.airResistance).x
        a.y = rv.normalize().mul(SnibeeSetting.maxVelocity * rb.airResistance).y
      } else if (rv.length() < SnibeeSetting.interiorDistance) {
        a.x = -rv.normalize().mul(SnibeeSetting.maxVelocity * rb.airResistance).x
        a.y = -rv.normalize().mul(SnibeeSetting.maxVelocity * rb.airResistance).y
      }
    }

    // 常にプレイヤーの方向を向く
    direction.looking = rv.x > 0 ? 'Right' : 'Left'

    yield
  }
}

const bulletFactory = new BulletFactory()
bulletFactory.speed = 120
bulletFactory.setRange(SnibeeSetting.exteriorDistance + 10)
bulletFactory.offset.y = 4

const shootAI = function*(entity: Entity, world: World, player: Entity): Behaviour<void> {
  while (true) {
    const pp = player.getComponent('Position')
    const ep = entity.getComponent('Position')
    const rv = pp.sub(ep)

    if (rv.length() < SnibeeSetting.exteriorDistance) {
      bulletFactory.setShooter(entity, 'enemy')
      bulletFactory.setDirection(rv)
      bulletFactory.angle += (Math.random() - 0.5) * SnibeeSetting.angleRange
      bulletFactory.type = 'needle'
      world.addEntity(bulletFactory.create())
      entity.getComponent('Sound').addSound('snibee')
      yield* wait(SnibeeSetting.coolTime + (Math.random() - 0.5) * SnibeeSetting.coolTimeRange)
    } else {
      yield
    }
  }
}

const aliveAI = function*(entity: Entity, world: World): Behaviour<void> {
  const playerEntity = new FamilyBuilder(world).include('Player').build().entityArray[0]
  yield* parallelAll([
    moveAI(entity, playerEntity),
    shootAI(entity, world, playerEntity),
    animate({ entity, state: 'Alive', loopCount: Infinity }),
  ])
}

const flutteringAI = function*(entity: Entity): Behaviour<void> {
  const rigidbody = entity.getComponent('RigidBody')
  yield* animate({ entity, state: 'FlutteringLeft' })
  yield* repeat(10, () => {
    rigidbody.acceleration.x = 500
  })
  yield* animate({ entity, state: 'FlutteringRight' })
  yield* repeat(20, () => {
    rigidbody.acceleration.x = -500
  })
  yield* animate({ entity, state: 'FlutteringLeft' })
  yield* repeat(10, () => {
    rigidbody.acceleration.x = 500
  })
}

export const snibeeAI = function*(entity: Entity, world: World): Behaviour<void> {
  yield* suspendable(isAlive(entity), aliveAI(entity, world))
  entity.getComponent('Sound').addSound('snibeeDie')
  yield* animate({ entity, state: 'Dying' })
  entity.getComponent('RigidBody').velocity.x = 0
  entity.getComponent('RigidBody').velocity.y = -3
  entity.getComponent('RigidBody').gravityScale = 0.05
  yield* emitAir(entity, world, 50)
  yield* flutteringAI(entity)
  yield* kill(entity, world)
}
