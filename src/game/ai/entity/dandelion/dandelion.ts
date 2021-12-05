import { Entity } from '@core/ecs/entity'
import { DandelionFluffFactory } from '@game/entities/dandelionFluffFactory'
import { World } from '@core/ecs/world'
import { Behaviour } from '@core/behaviour/behaviour'
import { Vec2 } from '@core/math/vec2'
import * as PIXI from 'pixi.js'
import DandelionStem from '@res/image/dandelionStem.png'
import { searchBySegment } from '../common/action/segmentSearch'
import { CategorySet } from '@game/entities/category'
import { parallelAll } from '@core/behaviour/composite'

const FLUFF_EMIT_INTERVAL = 200
const HEAD_OFFSET_Y = -96
const ROOT_OFFSET_Y = 160
const ROPE_POINT_NUM = 10
const HEAD_OSCILLATION_TIME_SCALE = 0.03

const head = function*(head: Entity): Behaviour<void> {
  const headPosition = head.getComponent('Position')
  const headOrigin = headPosition.copy()
  let s = 0
  while (true) {
    s += HEAD_OSCILLATION_TIME_SCALE
    const d = Math.sin(s) * 5 + Math.sin(s * 0.1) * 5
    headPosition.x = headOrigin.x + d
    yield
  }
}

const rope = function*(head: Entity, world: World): Behaviour<void> {
  const headPosition = head.getComponent('Position')

  const closestHit = yield* searchBySegment({
    start: headPosition,
    end: headPosition.add(new Vec2(0, ROOT_OFFSET_Y)),
    mask: new CategorySet('terrain'),
    world,
  })

  const rootPosition = closestHit.point
  const draw = head.getComponent('Draw')
  const points = new Array<PIXI.Point>(ROPE_POINT_NUM)
  for (let i = 0; i < points.length; i++) points[i] = new PIXI.Point(0, i * 2)
  const rope = new PIXI.SimpleRope(PIXI.Texture.from(DandelionStem), points)
  rope.zIndex = -1
  draw.sortableChildren = true
  draw.addChild(rope)

  while (true) {
    const dx = rootPosition.x - headPosition.x
    const dy = rootPosition.y - headPosition.y
    for (let i = 0; i < points.length; i++) {
      const t = i / (points.length - 1)
      const x = t * t * dx
      const y = t * dy
      points[i].x = x
      points[i].y = y
    }
    yield
  }
}

const emitFluff = function*(head: Entity, world: World): Behaviour<void> {
  const airHolder = head.getComponent('AirHolder')
  const factory = new DandelionFluffFactory(world, head)

  let t = 0
  while (true) {
    t += 1
    if (t % FLUFF_EMIT_INTERVAL == 0 && airHolder.quantity > 0) {
      world.addEntity(factory.create())
    }
    yield
  }
}

export const dandelionBehaviour = function*(entity: Entity, world: World): Behaviour<void> {
  const headPosition = entity.getComponent('Position')

  headPosition.y += HEAD_OFFSET_Y

  yield* parallelAll([head(entity), rope(entity, world), emitFluff(entity, world)])
}
