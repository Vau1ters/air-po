import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { airGeyserAI } from '@game/ai/entity/airGeyser/airGeyserAI'
import { AIComponent } from '@game/components/aiComponent'
import { ColliderComponent, buildCollider } from '@game/components/colliderComponent'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'
import { PHYSICS_TAG } from '@game/systems/physicsSystem'
import { Category, CategorySet } from '../category'
import { ObjectEntityFactory } from './objectEntityFactory'

export class AirGeyserFactory extends ObjectEntityFactory {
  private readonly COLLIDER = {
    type: 'AABB' as const,
    offset: new Vec2(0, 9),
    size: new Vec2(10, 13),
  }

  public maxQuantity = 120
  public increaseRate = 0.2

  public create(): Entity {
    const entity = super.create()

    entity.addComponent(
      'Collider',
      new ColliderComponent(
        buildCollider({
          entity,
          geometry: this.COLLIDER,
          category: Category.TERRAIN,
          mask: new CategorySet(Category.PHYSICS),
          tag: [PHYSICS_TAG],
        })
      )
    )
    entity.addComponent('RigidBody', new RigidBodyComponent())
    entity.addComponent(
      'AI',
      new AIComponent({
        behaviour: airGeyserAI(entity, this.world, {
          maxQuantity: this.maxQuantity,
          increaseRate: this.increaseRate,
        }),
        dependency: {
          after: ['AirHolderSystem:update'],
        },
      })
    )
    return entity
  }
}
