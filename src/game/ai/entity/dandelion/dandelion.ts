import { Entity } from '@core/ecs/entity'
import { DandelionFluffFactory } from '@game/entities/dandelionFluffFactory'
import { World } from '@core/ecs/world'
import { Behaviour } from '@core/behaviour/behaviour'
import { Vec2 } from '@core/math/vec2'
import * as PIXI from 'pixi.js'
import DandelionStem from '@res/image/dandelionStem.png'
import { SegmentSearcherFactory } from '@game/entities/segmentSearcherFactory'
import { Category } from '@game/entities/category'
import { segmentSearchGenerator } from '../segmentSearcher/segmentSearcherAI'
import { assert } from '@utils/assertion'
import { INFINITY_COORDINATE } from '@core/math/constants'

const FLUFF_EMIT_INTERVAL = 200
const HEAD_OFFSET_Y = -96
const ROOT_OFFSET_Y = 160
const ROPE_POINT_NUM = 10
const HEAD_OSCILLATION_TIME_SCALE = 0.03

export const dandelionBehaviour = function*(entity: Entity, world: World): Behaviour<void> {
  const headPosition = entity.getComponent('Position')
  const draw = entity.getComponent('Draw')

  headPosition.y += HEAD_OFFSET_Y

  const segmentSearcher = new SegmentSearcherFactory()
    .setSegmentStart(headPosition)
    .setSegmentEnd(headPosition.add(new Vec2(0, INFINITY_COORDINATE)))
    .addCategoryToMask(Category.TERRAIN)
    .create()
  world.addEntity(segmentSearcher)
  const getClosestHit = segmentSearchGenerator(segmentSearcher, { maximumDistance: ROOT_OFFSET_Y })

  yield

  const { value: closestHit } = getClosestHit.next()
  assert(closestHit instanceof Object, 'dandelion ai fails segment searching')
  const rootPosition = headPosition.copy()
  rootPosition.y = closestHit.point.y
  world.removeEntity(segmentSearcher)

  const points = new Array<PIXI.Point>(ROPE_POINT_NUM)
  for (let i = 0; i < points.length; i++) points[i] = new PIXI.Point(0, i * 2)
  const rope = new PIXI.SimpleRope(PIXI.Texture.from(DandelionStem), points)
  rope.zIndex = -100
  draw.sortableChildren = true
  draw.addChild(rope)

  const headOrigin = new Vec2(headPosition.x, headPosition.y)
  const n = headPosition.sub(rootPosition).normalize()
  let s = 0
  function updateHead(): void {
    s += HEAD_OSCILLATION_TIME_SCALE
    const d = Math.sin(s) * 5 + Math.sin(s * 0.1) * 5
    headPosition.x = headOrigin.x + d * n.y
    headPosition.y = headOrigin.y - d * n.x
  }

  function updateRope(): void {
    const dx = rootPosition.x - headPosition.x
    const dy = rootPosition.y - headPosition.y
    for (let i = 0; i < points.length; i++) {
      const t = i / (points.length - 1)
      const x = t * t * dx
      const y = t * dy
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
    updateRope()
    updateFluff()
    yield
  }
}
