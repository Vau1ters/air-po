import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { StemShape, StemState, transiteShape } from '../stem'
import { Vec2 } from '@core/math/vec2'
import { Boss1RootFactory } from '@game/entities/boss1RootFactory'
import { AABB } from '@core/collision/geometry/AABB'

const attack = (pos: Vec2, world: World): void => {
  const root = new Boss1RootFactory(pos, world).create()
  world.addEntity(root)
}

const s = (i: number): { stem: StemShape; arms: Array<StemShape> } => {
  const stem = (t: number): Vec2 => {
    const p = new Vec2(-Math.sin(t * 6 + i * 0.1) * Math.min(10, t * 100), -t * 100 + 10)
    const a = -0.5
    const c = Math.cos(a)
    const s = Math.sin(a)
    return new Vec2(p.x * c - p.y * s, p.x * s + p.y * c)
  }
  const armL = (t: number): Vec2 => {
    const p = stem(0.4)
    let s = i / 15
    s = 1 - 1 / (s * s * s + 1)
    const a = t * (5 - 2 * s)
    const h = -20 + 50 * s
    const w = 50 - Math.abs(h)
    const y = Math.sin(a) * h
    const x = (Math.cos(a) - 1) * w
    const b = s * s * 1.1
    const cos = Math.cos(b)
    const sin = Math.sin(b)
    const x2 = x * cos - y * sin
    const y2 = y * cos + x * sin
    return p.add(new Vec2(x2, y2))
  }
  const armR = (t: number): Vec2 => {
    const p = stem(0.5)
    let s = i / 25
    s = 1 - 1 / (s * s * s + 1)
    const a = t * (5 - 2 * s)
    const h = -20 + 50 * s
    const w = 50 - Math.abs(h)
    const y = Math.sin(a) * h
    const x = -(Math.cos(a) - 1) * w
    const b = -s * s * 1.1
    const cos = Math.cos(b)
    const sin = Math.sin(b)
    const x2 = x * cos - y * sin
    const y2 = y * cos + x * sin
    return p.add(new Vec2(x2, y2))
  }
  return {
    stem,
    arms: [armL, armR],
  }
}

export const root = function* (state: StemState, boss: Entity, world: World): Behaviour<void> {
  const W = 40
  const transiteStem = transiteShape(state.stem, W)
  const transiteArmL = transiteShape(state.arms[0], W)
  const transiteArmR = transiteShape(state.arms[1], W)
  for (let i = 0; i < W; i++) {
    const {
      stem,
      arms: [armL, armR],
    } = s(0)
    state.stem = transiteStem.next(stem).value as StemShape
    state.arms[0] = transiteArmL.next(armL).value as StemShape
    state.arms[1] = transiteArmR.next(armR).value as StemShape
    yield
  }
  const [_, rootCollider] = boss.getComponent('Collider').colliders
  const root = rootCollider.geometry as AABB

  const offset = Math.random() * 20
  const a = (i: number): void =>
    attack(
      boss
        .getComponent('Position')
        .add(root.center)
        .add(new Vec2(-50 - 50 * i - offset, 0)),
      world
    )
  for (let i = 0; i < 45; i++) {
    if (i % 10 === 0) a(i / 10)
    const {
      stem,
      arms: [armL, armR],
    } = s(i)
    state.stem = stem
    state.arms[0] = armL
    state.arms[1] = armR
    yield
  }
}
