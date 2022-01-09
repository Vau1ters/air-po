import { Behaviour } from '@core/behaviour/behaviour'
import { AABB } from '@core/collision/geometry/AABB'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { AnimationSprite } from '@core/graphics/animationSprite'
import { createSprite, getTexture, SpriteName } from '@core/graphics/art'
import { Vec2 } from '@core/math/vec2'
import { AiComponent } from '@game/components/aiComponent'
import { calcDirection } from '@utils/direction'
import * as PIXI from 'pixi.js'

export type StemShape = (t: number) => Vec2

export type StemState = {
  stem: StemShape
  arms: Array<StemShape>
}

export const composite =
  (a: StemShape, b: StemShape, s: number): ((t: number) => Vec2) =>
  (t: number): Vec2 =>
    a(t)
      .mul(1 - s)
      .add(b(t).mul(s))

export const transiteShape = function* (
  shape: StemShape,
  duration: number
): Generator<StemShape, void, StemShape> {
  let currentShape = shape
  for (let i = 0; i < duration; i++) {
    const nextShape = yield currentShape
    const t = i / duration
    currentShape = composite(shape, nextShape, t * t * (3 - 2 * t))
  }
  while (true) {
    currentShape = yield currentShape
  }
}

const fragment = (
  points: Array<PIXI.Point>,
  rate: number,
  offsetLength: number,
  offsetAngle: number,
  spriteName: SpriteName,
  boss: Entity,
  world: World
): AnimationSprite => {
  const fragment = createSprite(spriteName)
  fragment.zIndex = -2
  const entity = new Entity()

  const calcLengthList = (): Array<number> => {
    const ls: Array<number> = []
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i + 0]
      const p1 = points[i + 1]
      ls.push(new Vec2(p0.x - p1.x, p0.y - p1.y).length())
    }
    return ls
  }

  const calcPosition = (l: number, ls: Array<number>): Vec2 => {
    for (let i = 0; i < ls.length; i++) {
      const li = ls[i]
      if (l > li) {
        l -= li
      } else {
        const p0 = Vec2.fromPoint(points[i + 0])
        const p1 = Vec2.fromPoint(points[i + 1])
        return Vec2.mix(p0, p1, l / li)
      }
    }
    return Vec2.fromPoint(points[points.length - 1])
  }

  entity.addComponent(
    'Ai',
    new AiComponent(
      (function* (): Generator<void> {
        while (boss.getComponent('Hp').hp > 0) {
          const ls = calcLengthList()
          const lsum = ls.reduce((a, b) => a + b)
          if (lsum > 0) {
            const pos = calcPosition(lsum * rate, ls)
            const d = calcPosition(lsum * (rate + 0.05), ls).sub(pos)
            const angle = Math.atan2(d.y, d.x) + offsetAngle
            const v = pos.add(new Vec2(Math.cos(angle), Math.sin(angle)).mul(offsetLength))
            fragment.position.set(v.x, v.y)
            fragment.state = calcDirection(angle)
          }
          yield
        }
      })()
    )
  )
  world.addEntity(entity)
  return fragment
}

const addStem = (boss: Entity, width: number): Array<PIXI.Point> => {
  const points = new Array<PIXI.Point>(100)
  for (let i = 0; i < points.length; i++) points[i] = new PIXI.Point(0, i * 2)

  const stem = new PIXI.SimpleRope(getTexture('boss1Stem'), points, width)
  stem.tint = 0x22aa22
  stem.zIndex = -1
  boss.getComponent('Draw').addChild(stem)
  return points
}

export const stem = function* (state: StemState, boss: Entity, world: World): Behaviour<void> {
  const bossPosition = boss.getComponent('Position')
  const [_, rootCollider] = boss.getComponent('Collider').colliders
  const root = rootCollider.geometry as AABB

  boss.getComponent('Draw').sortableChildren = true
  const stemPoints = addStem(boss, 1.0)
  const armPointsList = state.arms.map(_ => addStem(boss, 0.6))

  for (let i = 0; i < 10; i++) {
    boss
      .getComponent('Draw')
      .addChild(fragment(stemPoints, i / 10, 5, Math.PI / 2, 'boss1Needle', boss, world))
    boss
      .getComponent('Draw')
      .addChild(
        fragment(stemPoints, 0.5 / 10 + i / 10, 5, -Math.PI / 2, 'boss1Needle', boss, world)
      )
  }
  for (const arm of armPointsList) {
    for (let i = 0; i < 10; i++) {
      boss
        .getComponent('Draw')
        .addChild(fragment(arm, i / 10, 3, Math.PI / 2, 'boss1Needle', boss, world))
      boss
        .getComponent('Draw')
        .addChild(fragment(arm, 0.5 / 10 + i / 10, 3, -Math.PI / 2, 'boss1Needle', boss, world))
    }
    for (let i = 0; i < 3; i++) {
      boss
        .getComponent('Draw')
        .addChild(fragment(arm, 0.5 / 20 + i / 3, 8, Math.PI / 2, 'boss1Leaf', boss, world))
      boss
        .getComponent('Draw')
        .addChild(fragment(arm, 0.5 / 20 + i / 3, 8, -Math.PI / 2, 'boss1Leaf', boss, world))
    }
  }

  while (true) {
    const { stem } = state
    bossPosition.x += root.center.x + stem(1).x
    bossPosition.y += root.center.y + stem(1).y
    root.center.x = -stem(1).x
    root.center.y = -stem(1).y
    for (let i = 0; i < stemPoints.length; i++) {
      const t = i / (stemPoints.length - 1)
      stemPoints[i].x = root.center.x + stem(t).x
      stemPoints[i].y = root.center.y + stem(t).y
    }
    for (let i = 0; i < armPointsList.length; i++) {
      const arm = state.arms[i]
      const armPoints = armPointsList[i]
      for (let j = 0; j < armPoints.length; j++) {
        const t = j / (armPoints.length - 1)
        armPoints[j].x = root.center.x + arm(t).x
        armPoints[j].y = root.center.y + arm(t).y
      }
    }
    yield
  }
}
