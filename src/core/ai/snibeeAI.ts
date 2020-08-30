import { Entity } from '../ecs/entity'
import { World } from '../ecs/world'
import { Behaviour } from './behaviour'
import { suspendable } from './decorator/suspendable'
import { isAlive } from './condition/isAlive'
import { kill } from './action/kill'
import { emitAir } from './action/emitAir'
import { FamilyBuilder } from '../ecs/family'
import { BulletFactory } from '../entities/bulletFactory'
import { wait } from './action/wait'
import { parallel } from './composite/compositeBehaviour'

const Setting = {
  interiorDistance: 80,
  exteriorDistance: 110,
  searchRange: 170,
  coolTime: 120,
  coolTimeRange: 30,
  angleRange: Math.PI / 6.0,
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

    if (rv.length() < Setting.searchRange) {
      if (rv.x === 0 && rv.y === 0) {
        // プレイヤーとの距離が0になったら動けなくなる可能背があるので緊急脱出
        v.x += (Math.random() - 0.5) * 10
        v.y += (Math.random() - 0.5) * 10
      } else if (rv.length() > Setting.exteriorDistance) {
        a.x = rv.normalize().mul(100).x
        a.y = rv.normalize().mul(100).y
      } else if (rv.length() < Setting.interiorDistance) {
        a.x = -rv.normalize().mul(100).x
        a.y = -rv.normalize().mul(100).y
      }
    }
    a.x -= v.x * Setting.airResistance
    a.y -= v.y * Setting.airResistance

    // 常にプレイヤーの方向を向く
    direction.changeDirection.notify(rv.x > 0 ? 'Right' : 'Left')

    yield
  }
}

const bulletFactory = new BulletFactory()
bulletFactory.speed = 2
bulletFactory.setRange(Setting.exteriorDistance + 10)
bulletFactory.offset.y = 4

const shootAI = function*(entity: Entity, world: World, player: Entity): Behaviour<void> {
  while (true) {
    const pp = player.getComponent('Position')
    const ep = entity.getComponent('Position')
    const rv = pp.sub(ep)

    if (rv.length() < Setting.exteriorDistance) {
      bulletFactory.shooter = entity
      bulletFactory.setDirection(rv)
      bulletFactory.angle += (Math.random() - 0.5) * Setting.angleRange
      bulletFactory.type = 'needle'
      world.addEntity(bulletFactory.create())
      yield* wait(Setting.coolTime + (Math.random() - 0.5) * Setting.coolTimeRange)
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
