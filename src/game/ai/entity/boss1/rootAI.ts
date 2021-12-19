import { Behaviour } from '@core/behaviour/behaviour'
import { ease } from '@core/behaviour/easing/easing'
import { wait } from '@core/behaviour/wait'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { kill } from '../common/action/kill'
import * as Sound from '@core/sound/sound'

const buruburu = function* (root: Entity): Generator<void> {
  const pos = root.getComponent('Position')
  const basePos = pos.copy()
  const w = 3
  for (let i = 0; i < 60; i++) {
    pos.assign(basePos.add(new Vec2((Math.random() * 2 - 1) * w, 0)))
    yield
  }
}

export const rootAI = function* (root: Entity, world: World): Behaviour<void> {
  const draw = root.getComponent('Draw')
  const pos = root.getComponent('Position')
  const attack = root.getComponent('Attack')
  const basePos = pos.copy()
  yield* buruburu(root)
  attack.damage = 1

  Sound.play('bossAttack1')
  yield* ease((t: number): number => t)(5, (y: number) => (pos.y = y), {
    from: basePos.y,
    to: basePos.y - draw.height + 10,
  })
  attack.damage = 0
  yield* wait.frame(50)
  yield* kill(root, world)
}
