import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'

export const animate = function*(
  entity: Entity,
  animationName: string,
  animationSpeed = 0.1
): Behaviour<void> {
  const animationState = entity.getComponent('AnimationState')
  animationState.state = animationName
  const animation = animationState.animation
  animation.animationSpeed = animationSpeed
  while (!animation.playing) yield // wait for starting animation
  while (animation.playing) yield // wait for finishing animation
}

export const animateLoop = function*(
  entity: Entity,
  animationName: string,
  animationSpeed = 0.1
): Behaviour<void> {
  entity.getComponent('AnimationState').state = animationName
  while (true) {
    animationName = entity.getComponent('AnimationState').state
    yield* animate(entity, animationName, animationSpeed)
  }
}
