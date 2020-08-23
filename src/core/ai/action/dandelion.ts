import { Entity } from '../../ecs/entity'
import { DandelionFluffFactory } from '../../entities/dandelionFluffFactory'
import { World } from '../../ecs/world'
import { Behaviour } from '../behaviour'
import { Vec2 } from '../../math/vec2'
import * as PIXI from 'pixi.js'

export const dandelionBehaviour = function*(entity: Entity, world: World): Behaviour<void> {
  const headPosition = entity.getComponent('Position')
  const draw = entity.getComponent('Draw')

  headPosition.y -= 48
  const rootPosition = headPosition.add(new Vec2(0, 128 + 32))

  const points = new Array<PIXI.Point>(10)
  for (let i = 0; i < points.length; i++) points[i] = new PIXI.Point(0, i * 2)
  const himo = new PIXI.SimpleRope(PIXI.Texture.WHITE, points, 0.3)
  himo.tint = 0x22ff22
  draw.addChild(himo)

  const headOrigin = new Vec2(headPosition.x, headPosition.y)
  const n = headPosition.sub(rootPosition).normalize()
  let s = 0
  function updateHead(): void {
    s += 0.03
    const d = Math.sin(s) * 5 + Math.sin(s * 0.1) * 5
    headPosition.x = headOrigin.x + d * n.y
    headPosition.y = headOrigin.y - d * n.x
  }

  function updateHimo(): void {
    const dx = rootPosition.x - headPosition.x
    const dy = rootPosition.y - headPosition.y
    const a = dy / Math.sqrt(Math.abs(dx))
    for (let i = 0; i < points.length; i++) {
      const x = (i / points.length) * dx
      const y = a * Math.sqrt(Math.abs(x))
      points[i].x = x
      points[i].y = y
    }
  }

  const factory = new DandelionFluffFactory(world, entity)

  let t = 0
  function updateFluff(): void {
    t += 1
    if (t % 200 == 0) {
      world.addEntity(factory.create())
    }
  }

  while (true) {
    updateHead()
    updateHimo()
    updateFluff()
    yield
  }
}
