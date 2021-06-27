import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { animate } from '../common/action/animate'
import { hasAir } from '../common/condition/hasAir'
import { SporeEffectFactory } from '@game/entities/effect/sporeEffectFactory'
import { Vec2 } from '@core/math/vec2'
import { World } from '@core/ecs/world'
import { CollisionCallbackArgs } from '@game/components/colliderComponent'
import { CollisionResultAABBAABB } from '@core/collision/collision/AABB_AABB'
import * as Sound from '@core/sound/sound'
import { suspendable } from '@core/behaviour/suspendable'

const JUMP_ACCEL = 500

export const mushroomAI = function*(entity: Entity, world: World): Behaviour<void> {
  const position = entity.getComponent('Position')
  const sporeFactory = new SporeEffectFactory(world)

  let landed = false

  const [jumpCollider] = entity.getComponent('Collider').colliders
  jumpCollider.callbacks.add((args: CollisionCallbackArgs) => {
    const { other } = args
    const { axis } = args as CollisionResultAABBAABB
    if (Math.abs(axis.y) !== 1) return
    landed = true
    other.entity.getComponent('RigidBody').velocity.y -= JUMP_ACCEL
    Sound.play('mushroom')
  })

  yield* suspendable(() => {
    return !hasAir(entity)()
  }, animate({ entity, state: 'Close', loopCount: Infinity }))

  for (let i = 0; i < 10; i++) {
    sporeFactory.setPosition(
      position.add(new Vec2(Math.random() * 5 - 30 + i * 6, Math.random() * 5 + 13))
    )
    world.addEntity(sporeFactory.create())
  }

  yield* animate({ entity, state: 'Opening', waitFrames: 5 })

  while (true) {
    yield* suspendable(() => !landed, animate({ entity, state: 'Open', loopCount: Infinity }))
    yield* animate({ entity, state: 'Landed', waitFrames: 5 })
    landed = false
    yield
  }
}
