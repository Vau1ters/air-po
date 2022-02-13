import { Entity } from '@core/ecs/entity'
import { Behaviour } from '@core/behaviour/behaviour'
import { assert } from '@utils/assertion'
import { Vec2 } from '@core/math/vec2'
import { wait } from '@core/behaviour/wait'

export type JumpDirection = 'Left' | 'Right'
export type JumpOption = {
  entity: Entity
  direction: JumpDirection
  upSpeed: number
  forwardSpeed: number
  footTag: string
}

export const jump = function* (option: JumpOption): Behaviour<void> {
  const rigidBody = option.entity.getComponent('RigidBody')
  const direction = option.entity.getComponent('HorizontalDirection')
  const collider = option.entity.getComponent('Collider')
  const footCollider = collider.getByTag(option.footTag)

  assert(footCollider !== undefined, `foot tag '${option.footTag}' is not a valid tag'`)

  direction.looking = option.direction

  const accel = new Vec2(option.forwardSpeed * direction.sign, -option.upSpeed)
  rigidBody.velocity.assign(rigidBody.velocity.add(accel))

  yield* wait.collision(footCollider)

  rigidBody.velocity.assign(new Vec2())
}
