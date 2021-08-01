import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { animate } from '../common/action/animate'
import { parallelAny } from '@core/behaviour/composite'
import { kill } from '../common/action/kill'

const sporeFalling = function*(entity: Entity): Behaviour<void> {
  let t = 0
  const pos = entity.getComponent('Position')
  const initialAngle = pos.x * 10 // 適当にばらけさせる
  const fallSpeed = (((pos.x * 10) % 4) + 1) * 0.05
  while (true) {
    pos.x += Math.sin((Math.PI * t + initialAngle) / 25)
    pos.y += fallSpeed
    t++
    yield
  }
}

export const SporeEffectAI = function*(entity: Entity, world: World): Behaviour<void> {
  yield* parallelAny([animate({ entity, state: 'Shine', waitFrames: 10 }), sporeFalling(entity)])
  yield* kill(entity, world)
}
