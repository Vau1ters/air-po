import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { Animation } from '@core/graphics/animation'

export const animate = function*(entity: Entity, animationName: string): Behaviour<void> {
  entity.getComponent('AnimationState').state = animationName
  const [child] = entity.getComponent('Draw').children
  const animation = child as Animation
  while (!animation.playing) yield
  while (animation.playing) yield
}

export const animateLoop = function*(entity: Entity, animationName: string): Behaviour<void> {
  entity.getComponent('AnimationState').state = animationName
  while (true) {
    animationName = entity.getComponent('AnimationState').state
    yield* animate(entity, animationName)
  }
}
