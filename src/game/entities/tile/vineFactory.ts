import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { addTag } from '@game/ai/entity/vine/changeVineLength'
import { vineAI } from '@game/ai/entity/vine/vineAI'
import { AIComponent } from '@game/components/aiComponent'
import { ColliderComponent, buildColliders } from '@game/components/colliderComponent'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'
import { VineComponent } from '@game/components/vineComponent'
import { PHYSICS_TAG } from '@game/systems/physicsSystem'
import { Category, CategorySet } from '../category'
import { TileEntityFactory } from './tileEntityFactory'

export const VINE_TAG = 'Vine'
export const VINE_TERRAIN_SENSOR_TAG = 'VineWallSensor'
export const VINE_AIR_SENSOR_TAG = 'VineAirSensor'

export class VineFactory extends TileEntityFactory {
  private readonly BODY_COLLIDER = {
    type: 'AABB' as const,
    size: new Vec2(16, 16),
  }

  private readonly TERRAIN_SENSOR_COLLIDER = {
    type: 'AABB' as const,
    size: new Vec2(14, 5),
  }

  private readonly AIR_SENSOR_COLLIDER = {
    type: 'AABB' as const,
    size: new Vec2(6, 6),
  }

  public create(): Entity {
    const entity = super.create()

    entity.addComponent(
      'Collider',
      new ColliderComponent(
        ...buildColliders({
          entity,
          colliders: [
            {
              geometry: this.BODY_COLLIDER,
              category: Category.TERRAIN,
              mask: new CategorySet(Category.PHYSICS),
              tag: [PHYSICS_TAG, VINE_TAG],
            },
            {
              geometry: this.TERRAIN_SENSOR_COLLIDER,
              category: Category.SENSOR,
              mask: new CategorySet(Category.TERRAIN),
              tag: [VINE_TERRAIN_SENSOR_TAG],
            },
            {
              geometry: this.AIR_SENSOR_COLLIDER,
              category: Category.SENSOR,
              mask: new CategorySet(Category.AIR),
              tag: [VINE_AIR_SENSOR_TAG],
            },
          ],
        })
      )
    )
    entity.addComponent('AI', new AIComponent(vineAI(entity)))
    entity.addComponent('RigidBody', new RigidBodyComponent())
    entity.addComponent('Vine', new VineComponent(entity, 0))

    addTag(entity)

    return entity
  }
}
