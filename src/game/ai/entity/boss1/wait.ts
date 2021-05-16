import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { spline } from './spline'
import { StemShape, StemState, transiteShape } from './stem'

const rot = (a: number, r: number): Vec2 => {
  return new Vec2(r * Math.cos(a), r * Math.sin(a))
}

const spiral = (n: number, r0: number, r1: number, a0: number, a1: number): Array<Vec2> => {
  const result = []
  for (let i = 0; i < n; i++) {
    const t = i / n
    const r = r0 + (r1 - r0) * t
    const a = a0 + (a1 - a0) * t
    result.push(rot(a, r))
  }
  return result
}

export const wait = function*(state: StemState, boss: Entity, world: World): Behaviour<void> {
  const transiteStem = transiteShape(state.stem, 10)
  const transiteArmL = transiteShape(state.arms[0], 10)
  const transiteArmR = transiteShape(state.arms[1], 10)
  for (let i = 0; i < 60; i++) {
    const stem = spline(
      [
        new Vec2(0, 0),
        new Vec2(-32, -32).add(rot(i * 0.02, 10)),
        new Vec2(+32, -64).add(rot(i * 0.04, 15)),
        new Vec2(0, -112).add(rot(i * 0.01, 5)),
        new Vec2(-32, -96).add(rot(-i * 0.03, 20)),
      ],
      50
    )
    const armL = spline(
      [
        stem(0.4),
        stem(0.4)
          .add(new Vec2(-30, -20))
          .add(rot(i * 0.02, 10)),
      ].concat(spiral(20, 20, 0, -1.5, -9).map(p => p.add(new Vec2(-60, -10).add(stem(0.4))))),
      20
    )
    const armR = spline(
      [
        stem(0.5),
        stem(0.5)
          .add(new Vec2(20, -10))
          .add(rot(-i * 0.01, 10)),
      ].concat(spiral(20, 20, 0, 0, -9).map(p => p.add(new Vec2(0, -30).add(stem(0.5))))),
      20
    )
    state.stem = transiteStem.next(stem).value as StemShape
    state.arms[0] = transiteArmL.next(armL).value as StemShape
    state.arms[1] = transiteArmR.next(armR).value as StemShape
    yield
  }
}
