import * as t from 'io-ts'
import { Entity } from '@core/ecs/entity'
import { AnimationStateComponent } from '@game/components/animationStateComponent'

export const AnimationStateSettingType = t.type({})
export type AnimationStateSetting = t.TypeOf<typeof AnimationStateSettingType>

export const loadAnimationStateComponent = (
  _: AnimationStateSetting,
  entity: Entity
): AnimationStateComponent => {
  return new AnimationStateComponent(entity)
}
