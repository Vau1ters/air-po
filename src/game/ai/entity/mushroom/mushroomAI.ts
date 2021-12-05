import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { animate } from '../common/action/animate'
import { SporeEffectFactory } from '@game/entities/effect/sporeEffectFactory'
import { Vec2 } from '@core/math/vec2'
import { World } from '@core/ecs/world'
import { CollisionCallbackArgs } from '@game/components/colliderComponent'
import { CollisionResultAABBAABB } from '@core/collision/collision/AABB_AABB'
import { suspendable } from '@core/behaviour/suspendable'
import { wait } from '@core/behaviour/wait'

const JUMP_ACCEL = 500

const emitSpore = (world: World, position: Vec2): void => {
  const sporeFactory = new SporeEffectFactory(world)

  for (let i = 0; i < 10; i++) {
    sporeFactory.setPosition(
      position.add(new Vec2(Math.random() * 5 - 30 + i * 6, Math.random() * 5))
    )
    world.addEntity(sporeFactory.create())
  }
}

export const mushroomAI = function*(entity: Entity, world: World): Behaviour<void> {
  const position = entity.getComponent('Position')
  const airHolder = entity.getComponent('AirHolder')

  let landed = false

  const [jumpCollider] = entity.getComponent('Collider').colliders
  jumpCollider.callbacks.add((args: CollisionCallbackArgs) => {
    const { other } = args
    const { axis } = args as CollisionResultAABBAABB
    if (Math.abs(axis.y) !== 1) return
    landed = true
    other.entity.getComponent('RigidBody').velocity.y -= JUMP_ACCEL
    entity.getComponent('Sound').addSound('mushroom')
    emitSpore(world, position.add(new Vec2(0, 5)))
  })

  while (true) {
    yield* animate({ entity, state: 'Close' })
    yield* wait.until(() => airHolder.quantity > 0)
    emitSpore(world, position.add(new Vec2(0, 13)))
    yield* animate({ entity, state: 'Opening', waitFrames: 5 })
    yield* suspendable(
      () => airHolder.quantity > 0,
      (function*(): Behaviour<void> {
        while (true) {
          yield* wait.until(() => landed)
          landed = false
          yield* animate({ entity, state: 'Landed', waitFrames: 5 })
        }
      })()
    )
    yield* animate({ entity, state: 'Opening', waitFrames: 5, reverse: true })
  }
}
