import { Behaviour } from '@core/behaviour/behaviour'
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
  let a = 0
  let s = 10
  const draw = (): void => {
    lock.getComponent('Position').assign(target.getComponent('Position'))
    g.clear()
    for (let i = 0; i < 4; i++) {
      drawRect(Math.cos(a + (i * Math.PI) / 2) * s, Math.sin(a + (i * Math.PI) / 2) * s)
    }
  }
  for (let t = 0; t < 10; t++) {
    a += 0.1
    s -= 0.5
    draw()
    yield
  }
  while (!isDespawning()) {
    a += 0.1
    draw()
    yield
  }
  for (let t = 0; t < 10; t++) {
    a += 0.1
    s += 0.5
    draw()
    yield
  }
  world.removeEntity(lock)
}
