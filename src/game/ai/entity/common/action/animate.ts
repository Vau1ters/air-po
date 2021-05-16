import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'

export const animate = function*(
  entity: Entity,
  animationName?: string,
  waitFrames?: number
): Behaviour<void> {
  const animationState = entity.getComponent('AnimationState')
  if (animationName) animationState.state = animationName
  yield* animationState.animation.animate(waitFrames)
}

export const animateLoop = function*(
  entity: Entity,
  animationName?: string,
  waitFrames?: number,
  loopCount = Infinity
): Behaviour<void> {
  for (let i = 0; i < loopCount; i++) {
    yield* animate(entity, animationName, waitFrames)
  }
}
