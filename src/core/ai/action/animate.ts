import { Behaviour } from '../behaviour'
import { Entity } from '../../ecs/entity'

export const animate = function*(entity: Entity, animationName: string): Behaviour<void> {
  entity.getComponent('AnimationState').state = animationName
}
