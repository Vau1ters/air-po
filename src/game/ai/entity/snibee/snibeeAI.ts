import { Entity } from '../../../../core/ecs/entity'
import { World } from '../../../../core/ecs/world'
import { Behaviour } from '../../../../core/behaviour/behaviour'
import { suspendable } from '../../../../core/behaviour/suspendable'
import { isAlive } from '../common/condition/isAlive'
import { kill } from '../common/action/kill'
import { emitAir } from '../common/action/emitAir'
import { FamilyBuilder } from '../../../../core/ecs/family'
import { BulletFactory } from '@game/entities/bulletFactory'
import { wait } from '../../../../core/behaviour/wait'
import { parallel } from '../../../../core/behaviour/composite'
import * as Sound from '../../../../core/sound/sound'

export const SnibeeSetting = {
  interiorDistance: 80,
  exteriorDistance: 110,
  searchRange: 170,
  coolTime: 120,
  coolTimeRange: 30,
  angleRange: Math.PI / 6.0,
  maxVelocity: 200, // px/s
  airResistance: 0.5,
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
        a.x = rv.normalize().mul(SnibeeSetting.maxVelocity * SnibeeSetting.airResistance).x
        a.y = rv.normalize().mul(SnibeeSetting.maxVelocity * SnibeeSetting.airResistance).y
      } else if (rv.length() < SnibeeSetting.interiorDistance) {
        a.x = -rv.normalize().mul(SnibeeSetting.maxVelocity * SnibeeSetting.airResistance).x
        a.y = -rv.normalize().mul(SnibeeSetting.maxVelocity * SnibeeSetting.airResistance).y
      }
    }
    a.x -= v.x * SnibeeSetting.airResistance
    a.y -= v.y * SnibeeSetting.airResistance

    // 常にプレイヤーの方向を向く
    direction.looking = rv.x > 0 ? 'Right' : 'Left'

    yield
  }
}

const bulletFactory = new BulletFactory()
bulletFactory.speed = 2
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
      Sound.play('snibee')
      yield* wait(SnibeeSetting.coolTime + (Math.random() - 0.5) * SnibeeSetting.coolTimeRange)
    } else {
      yield
    }
  }
}

const aliveAI = function*(entity: Entity, world: World): Behaviour<void> {
  const playerEntity = new FamilyBuilder(world).include('Player').build().entityArray[0]
  yield* parallel([moveAI(entity, playerEntity), shootAI(entity, world, playerEntity)])
}

export const snibeeAI = function*(entity: Entity, world: World): Behaviour<void> {
  yield* suspendable(isAlive(entity), aliveAI(entity, world))
  yield* emitAir(entity, world, 50)
  yield* kill(entity, world)
}
