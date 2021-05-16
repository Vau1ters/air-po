import { Behaviour } from '@core/behaviour/behaviour'
import { wait } from '@core/behaviour/wait'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { BulletFactory } from '@game/entities/bulletFactory'
import * as Sound from '@core/sound/sound'
import { FamilyBuilder } from '@core/ecs/family'
import { stem, StemShape, StemState, transiteShape } from './stem'
import { Vec2 } from '@core/math/vec2'
import { spline } from './spline'
import { parallelAll } from '@core/behaviour/composite'

const bulletFactory = new BulletFactory()
bulletFactory.speed = 120
bulletFactory.setRange(400)
bulletFactory.offset.y = 4

const shape = function*(state: StemState) {
  const transiteStem = transiteShape(state.stem, 60)
  for (let i = 0; i < 60; i++) {
    state.stem = transiteStem.next(
      spline([new Vec2(0, 0), new Vec2(10 + i * 0.1, -110), new Vec2(-20, -80)], 30)
    ).value as StemShape
    yield
  }
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 10; j++) {
      const t = j / 10
      state.stem = transiteStem.next(
        spline([new Vec2(0, 0), new Vec2(16 - t * 10, -110), new Vec2(-20 - t * 10, -80)], 30)
      ).value as StemShape
      yield
    }
  }
}

const attack = function*(state: StemState, boss: Entity, world: World) {
  yield* wait(60)
  const [player] = new FamilyBuilder(world).include('Player').build().entityArray
  for (let i = 0; i < 3; i++) {
    for (const arm of state.arms) {
      const pp = player.getComponent('Position')
      const ap = arm(1).sub(state.stem(1))
      const ep = boss.getComponent('Position').add(ap)
      const rv = pp.sub(ep)
      bulletFactory.setShooter(boss, 'enemy')
      bulletFactory.setDirection(rv)
      bulletFactory.offset = ap
      bulletFactory.angle += (Math.random() - 0.5) * 0.01
      bulletFactory.type = 'needle'
      world.addEntity(bulletFactory.create())
    }
    Sound.play('snibee')
    yield* wait(10)
  }
}

export const shot = function*(state: StemState, boss: Entity, world: World): Behaviour<void> {
  yield* parallelAll([shape(state), attack(state, boss, world)])
}
