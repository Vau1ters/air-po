import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { airGeyserAI } from '@game/ai/entity/airGeyser/airGeyserAI'
import { AIComponent } from '@game/components/aiComponent'
import { ColliderComponent, buildCollider } from '@game/components/colliderComponent'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'
import { MapObject } from '@game/map/mapBuilder'
import { PHYSICS_TAG } from '@game/systems/physicsSystem'
import { Category, CategorySet } from '../category'
import { ObjectEntityFactory } from './objectEntityFactory'

export class AirGeyserFactory extends ObjectEntityFactory {
  private readonly COLLIDER = {
    type: 'AABB' as const,
    offset: new Vec2(0, 9),
    size: new Vec2(10, 13),
  }

  constructor(name: string, private object: MapObject, world: World) {
    super(name, ObjectEntityFactory.calcPosition(object), world)
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
