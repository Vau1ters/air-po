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
    size: new Vec2(10, 14),
  }

  public create(): Entity {
    const maxQuantity =
      (this.object.properties?.find(property => property.name === 'maxQuantity')
        ?.value as number) ?? 120
    const increaseRate =
      (this.object.properties?.find(property => property.name === 'increaseRate')
        ?.value as number) ?? 0.2

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
          maxQuantity,
          increaseRate,
        }),
        dependency: {
          after: ['AirHolderSystem:update'],
        },
      })
    )
    return entity
  }
}
