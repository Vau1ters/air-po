import { Entity } from '../../../ecs/entity'
import { DandelionFluffFactory } from '../../../ecs/entities/dandelionFluffFactory'
import { World } from '../../../ecs/world'
import { Behaviour } from '../../behaviour'
import { Vec2 } from '../../../math/vec2'
import * as PIXI from 'pixi.js'

const FLUFF_EMIT_INTERVAL = 200
const HEAD_OFFSET_Y = -48
const ROOT_OFFSET_Y = 160
const HIMO_WIDTH = 0.3
const HIMO_COLOR = 0x22ff22
const HIMO_POINT_NUM = 10
const HEAD_OSCILLATION_TIME_SCALE = 0.03

export const dandelionBehaviour = function*(entity: Entity, world: World): Behaviour<void> {
  const headPosition = entity.getComponent('Position')
  const draw = entity.getComponent('Draw')

  headPosition.y += HEAD_OFFSET_Y
  const rootPosition = headPosition.add(new Vec2(0, ROOT_OFFSET_Y))

  const points = new Array<PIXI.Point>(HIMO_POINT_NUM)
  for (let i = 0; i < points.length; i++) points[i] = new PIXI.Point(0, i * 2)
  const himo = new PIXI.SimpleRope(PIXI.Texture.WHITE, points, HIMO_WIDTH)
  himo.tint = HIMO_COLOR
  draw.addChild(himo)

  const headOrigin = new Vec2(headPosition.x, headPosition.y)
  const n = headPosition.sub(rootPosition).normalize()
  let s = 0
  function updateHead(): void {
    s += HEAD_OSCILLATION_TIME_SCALE
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
    if (t % FLUFF_EMIT_INTERVAL == 0) {
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
