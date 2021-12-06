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

  const accel = new Vec2()
  switch (option.direction) {
    case 'Left':
      accel.x = -option.forwardSpeed
      break
    case 'Right':
      accel.x = option.forwardSpeed
      break
  }
  accel.y = -option.upSpeed
  rigidBody.velocity.assign(rigidBody.velocity.add(accel))

  let isGround = false
  const footCallback = (): void => {
    isGround = true
  }
  footCollider.callbacks.add(footCallback)

  yield* wait.until(() => isGround)
  footCollider.callbacks.delete(footCallback)
  rigidBody.velocity.assign(new Vec2())
}
