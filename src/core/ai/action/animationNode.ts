import { Behaviour } from '../behaviourNode'
import { Entity } from '../../ecs/entity'

export const animationNode = (animationName: string) =>
  function*(entity: Entity): Behaviour {
    entity.getComponent('AnimationState').state = animationName
    return 'Success'
  }
