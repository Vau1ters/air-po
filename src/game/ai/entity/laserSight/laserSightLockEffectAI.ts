import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAll, parallelAny } from '@core/behaviour/composite'
import { ease } from '@core/behaviour/easing/easing'
import { In } from '@core/behaviour/easing/functions'
import { loop } from '@core/behaviour/loop'
import { suspendable } from '@core/behaviour/suspendable'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Graphics } from 'pixi.js'

export const laserSightLockEffectAI = function*(
  lock: Entity,
  target: Entity,
  isDespawning: () => boolean,
  world: World
): Behaviour<void> {
  const [g] = lock.getComponent('Draw').children as [Graphics]
  const drawRect = (x: number, y: number): void => {
    const w = 2
    g.beginFill(0xff0000)
    g.drawRect(x - w / 2, y - w / 2, w, w)
  }

  const state = { angle: 0, radius: 10 }
  const angleEase = loop(frame => (state.angle = frame * 0.1))
  const radiusIn = ease(In.linear)(10, radius => (state.radius = radius), { from: 10, to: 5 })
  const radiusOut = ease(In.linear)(10, radius => (state.radius = radius), { from: 5, to: 10 })
  const draw = loop(() => {
    lock.getComponent('Position').assign(target.getComponent('Position'))
    g.clear()
    for (let i = 0; i < 4; i++) {
      drawRect(
        Math.cos(state.angle + (i * Math.PI) / 2) * state.radius,
        Math.sin(state.angle + (i * Math.PI) / 2) * state.radius
      )
    }
  })
  yield* parallelAny([angleEase, radiusIn, draw])
  yield* suspendable(() => !isDespawning(), parallelAll([angleEase, draw]))
  yield* parallelAny([angleEase, radiusOut, draw])
  world.removeEntity(lock)
}
