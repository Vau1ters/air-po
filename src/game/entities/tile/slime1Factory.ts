import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { slime1AI } from '@game/ai/entity/slime1/slime1AI'
import { AIComponent } from '@game/components/aiComponent'
import { AttackComponent } from '@game/components/attackComponent'
import { ColliderComponent, buildColliders } from '@game/components/colliderComponent'
import { HorizontalDirectionComponent } from '@game/components/directionComponent'
import { HPComponent } from '@game/components/hpComponent'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'
import { HITBOX_TAG, ATTACK_TAG } from '@game/systems/damageSystem'
import { PHYSICS_TAG } from '@game/systems/physicsSystem'
import { Category, CategorySet } from '../category'
import { TileEntityFactory } from './mapObjectFactory'

export class Slime1Factory extends TileEntityFactory {
  private readonly BODY_COLLIDER = {
    type: 'AABB' as const,
    offset: new Vec2(0, 1),
    size: new Vec2(16, 12),
    maxClipToTolerance: new Vec2(2, 2),
  }

  private readonly HIT_BOX_COLLIDER = {
    type: 'AABB' as const,
    size: new Vec2(10, 13),
  }

  private readonly RIGID_BODY = {
    mass: 10,
    gravityScale: 1,
  }

  public create(): Entity {
    const entity = super.create()

    entity.addComponent('AI', new AIComponent(slime1AI(entity, this.world)))
    entity.addComponent('RigidBody', new RigidBodyComponent(this.RIGID_BODY))
    entity.addComponent(
      'Collider',
      new ColliderComponent(
        ...buildColliders({
          entity,
          colliders: [
            {
              geometry: this.BODY_COLLIDER,
              category: Category.PHYSICS,
              mask: new CategorySet(Category.TERRAIN),
              tag: [PHYSICS_TAG],
            },
            {
              geometry: this.BODY_COLLIDER,
              category: Category.ENEMY_HITBOX,
              tag: [HITBOX_TAG],
            },
            {
              geometry: this.HIT_BOX_COLLIDER,
              category: Category.ATTACK,
              mask: new CategorySet(Category.PLAYER_HITBOX),
              tag: [ATTACK_TAG],
            },
          ],
        })
      )
    )
    entity.addComponent('Attack', new AttackComponent(1, false))
    entity.addComponent('HP', new HPComponent(2, 2))
    entity.addComponent('HorizontalDirection', new HorizontalDirectionComponent(entity, 'Right'))
    return entity
  }
}
