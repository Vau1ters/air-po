import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { balloonvineAI } from '@game/ai/entity/balloonVine/balloonVineAI'
import { AIComponent } from '@game/components/aiComponent'
import { AirHolderComponent } from '@game/components/airHolderComponent'
import { ColliderComponent, buildColliders } from '@game/components/colliderComponent'
import { HPComponent } from '@game/components/hpComponent'
import { InvincibleComponent } from '@game/components/invincibleComponent'
import { PickupTargetComponent } from '@game/components/pickupTargetComponent'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'
import { AIR_HOLDER_TAG } from '@game/systems/airHolderSystem'
import { Category, CategorySet } from '../category'
import { TileEntityFactory } from './tileEntityFactory'

export class BalloonVineFactory extends TileEntityFactory {
  private readonly GRIP_COLLIDER = {
    type: 'AABB' as const,
    maxClipToTolerance: new Vec2(2, 2),
  }

  private readonly BODY_COLLIDER = {
    type: 'AABB' as const,
    size: new Vec2(10, 13),
    maxClipToTolerance: new Vec2(2, 2),
  }

  private readonly ROOT_COLLIDER = {
    type: 'AABB' as const,
    size: new Vec2(5, 5),
  }

  private readonly TERRAIN_COLLIDER = {
    type: 'AABB' as const,
    size: new Vec2(2, 10),
  }

  private readonly AIR_HOLDER = {
    initialQuantity: 0,
    maxQuantity: 10,
    collectSpeed: 10,
    consumeSpeed: 0,
    shouldDamageInSuffocation: false,
  }

  private readonly RIGID_BODY = {
    mass: 0.0001,
    gravityScale: 1,
  }

  public create(): Entity {
    const entity = super.create()

    entity.addComponent('AI', new AIComponent(balloonvineAI(entity, this.world)))
    entity.addComponent('RigidBody', new RigidBodyComponent(this.RIGID_BODY))
    entity.addComponent(
      'Collider',
      new ColliderComponent(
        ...buildColliders({
          entity,
          colliders: [
            {
              geometry: this.GRIP_COLLIDER,
              category: Category.ITEM,
            },
            {
              geometry: this.BODY_COLLIDER,
              category: Category.ENEMY_HITBOX,
              condition: (): boolean => entity.getComponent('PickupTarget').isPossessed === false,
            },
            {
              geometry: this.BODY_COLLIDER,
              category: Category.AIR_HOLDER,
              mask: new CategorySet(Category.AIR),
              tag: [AIR_HOLDER_TAG],
            },
            {
              geometry: this.ROOT_COLLIDER,
              category: Category.PHYSICS,
              mask: new CategorySet(Category.TERRAIN),
            },
            {
              geometry: this.TERRAIN_COLLIDER,
              category: Category.SENSOR,
              mask: new CategorySet(Category.TERRAIN),
            },
          ],
        })
      )
    )

    entity.addComponent('HP', new HPComponent(1, 1))
    entity.addComponent('Invincible', new InvincibleComponent())
    entity.addComponent('PickupTarget', new PickupTargetComponent(false))
    entity.addComponent('AirHolder', new AirHolderComponent(this.AIR_HOLDER))

    if (this.frame === 1) entity.getComponent('AirHolder').quantity = this.AIR_HOLDER.maxQuantity
    return entity
  }
}
