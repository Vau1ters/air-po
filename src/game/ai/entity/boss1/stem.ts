import { Behaviour } from '@core/behaviour/behaviour'
import { AABB } from '@core/collision/geometry/AABB'
import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import * as PIXI from 'pixi.js'

export type StemState = {
  shape: (t: number) => Vec2
}

export const stem = function*(state: StemState, boss: Entity): Behaviour<void> {
  const bossPosition = boss.getComponent('Position')
  const [_, rootCollider] = boss.getComponent('Collider').colliders
  const root = rootCollider.geometry as AABB

  const points = new Array<PIXI.Point>(10)
  for (let i = 0; i < points.length; i++) points[i] = new PIXI.Point(0, i * 2)

  const stem = new PIXI.SimpleRope(PIXI.Texture.WHITE, points, 0.4)
  stem.tint = 0x22aa22
  stem.zIndex = -1
  boss.getComponent('Draw').sortableChildren = true
  boss.getComponent('Draw').addChild(stem)

  while (true) {
    const { shape } = state
    bossPosition.x += root.center.x + shape(1).x
    bossPosition.y += root.center.y + shape(1).y
    root.center.x = -shape(1).x
    root.center.y = -shape(1).y
    for (let i = 0; i < points.length; i++) {
      const t = i / (points.length - 1)
      points[i].x = root.center.x + shape(t).x
      points[i].y = root.center.y + shape(t).y
    }
    yield
  }
}
