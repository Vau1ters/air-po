import { Entity } from '../ecs/entity'
import { World } from '../ecs/world'
import { Behaviour } from './behaviour'
import { suspendable } from './decorator/suspendable'
import { isAlive } from './condition/isAlive'
import { kill } from './action/kill'
import { emitAir } from './action/emitAir'
import { FamilyBuilder } from '../ecs/family'
import { BulletFactory } from '../entities/bulletFactory'
import { Vec2 } from '../math/vec2'
import { wait } from './action/wait'
import { parallel } from './composite/compositeBehaviour'

const Setting = {
  interiorDistance: 80,
  exteriorDistance: 105,
  searchRange: 160,
  coolTime: 120,
  coolTimeRange: 30,
  angleRange: 30.0,
}

const moveAI = function*(entity: Entity, player: Entity): Behaviour<void> {
  const direction = entity.getComponent('HorizontalDirection')

  while (true) {
    const pp = player.getComponent('Position')
    const ep = entity.getComponent('Position')
    const rv = pp.sub(ep)

    if (rv.length() < Setting.searchRange) {
      if (rv.length() > Setting.exteriorDistance) {
        ep.x += rv.normalize().mul(0.4).x
        ep.y += rv.normalize().mul(1.0).y
      } else if (rv.length() < Setting.interiorDistance) {
        ep.x -= rv.normalize().mul(0.4).x
        ep.y -= rv.normalize().mul(1.0).y
      }
    }

    // 常にプレイヤーの方向を向く
    direction.changeDirection.notify(rv.x > 0 ? 'Right' : 'Left')

    yield
  }
}

const bulletFactory = new BulletFactory()

const calcAngle = (vector: Vec2): number => {
  return (Math.atan2(vector.y, vector.x) * 180) / Math.PI
}

const shootAI = function*(entity: Entity, world: World, player: Entity): Behaviour<void> {
  while (true) {
    const pp = player.getComponent('Position')
    const ep = entity.getComponent('Position')
    const rv = pp.sub(ep)

    if (rv.length() < Setting.exteriorDistance) {
      bulletFactory.shooter = entity
      bulletFactory.angle = calcAngle(rv) + (Math.random() - 0.5) * Setting.angleRange
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
