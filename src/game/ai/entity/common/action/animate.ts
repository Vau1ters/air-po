import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'

export const animate = function*(
  entity: Entity,
  animationName: string,
  waitFrames = 10
): Behaviour<void> {
  const animationState = entity.getComponent('AnimationState')
  animationState.state = animationName
  const animation = animationState.animation
  yield* animation.animate(waitFrames)
}

export const animateLoop = function*(
  entity: Entity,
  animationName: string,
  waitFrames = 10,
  loopCount = Infinity
): Behaviour<void> {
  entity.getComponent('AnimationState').state = animationName
  for (let i = 0; i < loopCount; i++) {
    yield* animate(entity, animationName, waitFrames)
  }
}
