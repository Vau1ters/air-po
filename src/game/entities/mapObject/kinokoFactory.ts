import { CollisionResultAABBAABB } from '@core/collision/collision/AABB_AABB'
import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { kinokoAI } from '@game/ai/entity/kinoko/kinokoAI'
import { AIComponent } from '@game/components/aiComponent'
import { AirHolderComponent } from '@game/components/airHolderComponent'
import {
  ColliderComponent,
  buildColliders,
  CollisionCallbackArgs,
} from '@game/components/colliderComponent'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'
import { AIR_HOLDER_TAG } from '@game/systems/airHolderSystem'
import { PHYSICS_TAG } from '@game/systems/physicsSystem'
import { Category, CategorySet } from '../category'
import { MapObjectFactory } from './mapObjectFactory'

export class KinokoFactory extends MapObjectFactory {
  private readonly WALL_COLLIDER = {
    type: 'AABB' as const,
    size: new Vec2(20, 64),
  }

  private readonly FLOOR_COLLIDER = {
    type: 'AABB' as const,
    offset: new Vec2(0, -16),
    size: new Vec2(88, 32),
  }

  private readonly AIR_HOLDER_COLLIDER = {
    type: 'AABB' as const,
    size: new Vec2(96, 96),
  }

  private readonly AIR_HOLDER = {
    initialQuantity: 0,
    maxQuantity: 1,
    collectSpeed: 1,
    consumeSpeed: 0,
  }

  private readonly JUMP_ACCEL = 500

  public create(): Entity {
    const entity = super.create()

    entity.addComponent(
      'Collider',
      new ColliderComponent(
        ...buildColliders({
          entity,
          colliders: [
            {
              geometry: this.FLOOR_COLLIDER,
              category: Category.TERRAIN,
              mask: new CategorySet(Category.PHYSICS),
              tag: [PHYSICS_TAG],
              condition: (): boolean => entity.getComponent('AirHolder').quantity > 0,
            },
            {
              geometry: this.WALL_COLLIDER,
              category: Category.TERRAIN,
              mask: new CategorySet(Category.PHYSICS),
              tag: [PHYSICS_TAG],
            },
            {
              geometry: this.AIR_HOLDER_COLLIDER,
              category: Category.AIR_HOLDER,
              mask: new CategorySet(Category.AIR),
              tag: [AIR_HOLDER_TAG],
            },
          ],
        })
      )
    )
    entity.addComponent('RigidBody', new RigidBodyComponent())
    entity.addComponent('AirHolder', new AirHolderComponent(this.AIR_HOLDER))
    entity.addComponent('AI', new AIComponent(kinokoAI(entity)))

    const [floorCollider] = entity.getComponent('Collider').colliders
    floorCollider.callbacks.add((args: CollisionCallbackArgs) => {
      const { other } = args
      const { axis } = args as CollisionResultAABBAABB
      if (axis.y !== 1) return
      other.entity.getComponent('RigidBody').velocity.y -= this.JUMP_ACCEL
    })

    if (this.frame === 0) entity.getComponent('AirHolder').quantity = this.AIR_HOLDER.maxQuantity

    return entity
  }
}
