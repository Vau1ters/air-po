import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'

export const animate = function*(entity: Entity, animationName: string): Behaviour<void> {
  entity.getComponent('AnimationState').state = animationName
}
