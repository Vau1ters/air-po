import { windowSize } from '@core/application'
import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAll } from '@core/behaviour/composite'
import { ease } from '@core/behaviour/easing/easing'
import { Out } from '@core/behaviour/easing/functions'
import { wait } from '@core/behaviour/wait'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { MouseController } from '@game/systems/controlSystem'
import { getSingleton } from '@game/systems/singletonSystem'
import { Graphics } from 'pixi.js'

const updateCollider = function* (laser: Entity, world: World): Behaviour<void> {
  while (true) {
    const camera = getSingleton('Camera', world)
    const mousePosition = MouseController.position
    const cameraPosition = camera.getComponent('Position')
    const mousePositionOnScreen = mousePosition.sub(
      new Vec2(windowSize.width / 2, windowSize.height / 2)
    )
    laser.getComponent('Position').assign(cameraPosition.add(mousePositionOnScreen))

    yield
  }
}

const updateSprite = function* (laser: Entity, world: World): Behaviour<void> {
  const player = getSingleton('Player', world)
  const [_, collider] = laser.getComponent('Collider').colliders
  const [g] = laser.getComponent('Draw').children as [Graphics]

  const drawCenter = (p: Vec2) => {
    const r = p.sub(laser.getComponent('Position'))
    g.clear()
    g.beginFill(0xff0000)
    g.drawRect(r.x - 2, r.y - 2, 4, 4)
    g.endFill()
  }

  const drawCorners = (p: Vec2, l: number) => {
    const r = p.sub(laser.getComponent('Position'))
    for (let i = 0; i < 4; i++) {
      const sx = (i & 1) * 2 - 1
      const sy = (i >> 1) * 2 - 1
      g.lineStyle(1, 0xff0000, undefined, undefined, true)
      g.moveTo(r.x + (l - 0) * sx, r.y + (l - 0) * sy)
      g.lineTo(r.x + (l - 6) * sx, r.y + (l - 0) * sy)
      g.moveTo(r.x + (l - 0) * sx, r.y + (l - 0) * sy)
      g.lineTo(r.x + (l - 0) * sx, r.y + (l - 6) * sy)
    }
  }

  const draw = (pos: Vec2, l: number): void => {
    drawCenter(pos)
    drawCorners(pos, l)
  }

  const drawAnimation = function* (
    pos: Vec2,
    option: { from: number; to: number }
  ): Behaviour<void> {
    yield* ease(Out.quad)(20, (l: number): void => draw(pos, l), option)
  }

  while (true) {
    drawCenter(laser.getComponent('Position'))

    const args = yield* wait.collision(collider)

    const pos = args[0].other.entity.getComponent('Position')
    player.getComponent('Player').searchTarget = args[0].other.entity

    yield* drawAnimation(pos, { from: 16, to: 8 })

    while (true) {
      draw(pos, 8)
      const args = yield* wait.collision(collider, { allowNoCollision: true })
      if (args.length === 0) break
    }

    player.getComponent('Player').searchTarget = undefined

    yield* drawAnimation(pos, { from: 8, to: 16 })
  }
}

export const searchLaserSightAI = function* (laser: Entity, world: World): Behaviour<void> {
  yield* parallelAll([updateCollider(laser, world), updateSprite(laser, world)])
}
