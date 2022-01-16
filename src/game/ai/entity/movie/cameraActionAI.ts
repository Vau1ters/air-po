import { Behaviour } from '@core/behaviour/behaviour'
import { ease } from '@core/behaviour/easing/easing'
import { Out } from '@core/behaviour/easing/functions'
import { Family } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { CameraAction } from '@game/movie/movie'
import { getSingleton } from '@game/systems/singletonSystem'
import { resolvePosition } from './util'

export const cameraActionAI = function* (
  action: CameraAction,
  world: World,
  nameFamily: Family
): Behaviour<void> {
  const camera = getSingleton('Camera', world)

  const pos = camera.getComponent('Position')
  const start = pos.copy()
  const end = resolvePosition(action.to, nameFamily)

  switch (action.type) {
    case 'ease':
      yield* ease(Out.quad)(50, (value: number): void => {
        pos.assign(Vec2.mix(start, end, value))
      })
      break
    case 'warp':
      pos.assign(end)
      break
  }
}
