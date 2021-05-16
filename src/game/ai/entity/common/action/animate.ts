import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'

export type AnimationOption = {
  entity: Entity
  state?: string
  loopCount?: number
  waitFrames?: number
}

export const animate = function*(option: AnimationOption): Behaviour<void> {
  const entity = option.entity
  const animationState = entity.getComponent('AnimationState')
  const state = option.state ?? animationState.state
  const loopCount = option.loopCount ?? 1
  const waitFrames = option.waitFrames

  for (let i = 0; i < loopCount; i++) {
    animationState.state = state
    yield* animationState.animation.animate(waitFrames)
  }
}
