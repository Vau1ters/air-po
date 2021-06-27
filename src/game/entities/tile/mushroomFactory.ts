import { CollisionResultAABBAABB } from '@core/collision/collision/AABB_AABB'
import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { mushroomAI } from '@game/ai/entity/mushroom/mushroomAI'
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
import { TileEntityFactory } from './tileEntityFactory'
import * as Sound from '@core/sound/sound'
import { createSound } from '../soundFactory'

export class MushroomFactory extends TileEntityFactory {
  private readonly WALL_COLLIDER = {
    type: 'AABB' as const,
    size: new Vec2(20, 64),
  }

  private readonly JUMP_COLLIDER = {
    type: 'AABB' as const,
    offset: new Vec2(0, -24),
    size: new Vec2(88, 16),
  }

  private readonly FLOOR_COLLIDER = {
    type: 'AABB' as const,
    offset: new Vec2(0, -8),
    size: new Vec2(88, 16),
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
    shouldDamageInSuffocation: false,
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
              geometry: this.JUMP_COLLIDER,
              category: Category.TERRAIN,
              mask: new CategorySet(Category.PHYSICS),
              tag: [PHYSICS_TAG],
              condition: (): boolean => entity.getComponent('AirHolder').quantity > 0,
            },
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
    entity.addComponent('AI', new AIComponent(mushroomAI(entity)))

    const [jumpCollider] = entity.getComponent('Collider').colliders
    jumpCollider.callbacks.add((args: CollisionCallbackArgs) => {
      const { other } = args
      const { axis } = args as CollisionResultAABBAABB
      if (Math.abs(axis.y) !== 1) return
      other.entity.getComponent('RigidBody').velocity.y -= this.JUMP_ACCEL
      // Sound.play('mushroom')
      createSound(entity, 'mushroom')
    })

    if (this.frame === 0) entity.getComponent('AirHolder').quantity = this.AIR_HOLDER.maxQuantity

    return entity
  }
}
