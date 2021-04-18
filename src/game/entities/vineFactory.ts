import { Entity } from '@core/ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '@game/components/positionComponent'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { buildColliders, ColliderComponent } from '@game/components/colliderComponent'
import { Vec2 } from '@core/math/vec2'
import { Category, CategorySet } from './category'
import vineDefinition from '@res/animation/vine.json'
import { VineComponent } from '@game/components/vineComponent'
import { AIComponent } from '@game/components/aiComponent'
import { vineAI } from '@game/ai/entity/vine/vineAI'
import { parseAnimation } from '@core/graphics/animationParser'
import { addTag } from '@game/ai/entity/vine/changeVineLength'
import { PHYSICS_TAG } from '@game/systems/physicsSystem'

export const VINE_TAG = 'Vine'
export const VINE_TERRAIN_SENSOR_TAG = 'VineWallSensor'
export const VINE_AIR_SENSOR_TAG = 'VineAirSensor'

export class VineFactory extends EntityFactory {
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

  public constructor() {
    super()
  }

  public create(): Entity {
    const entity = new Entity()

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
    entity.addComponent('Position', new PositionComponent())
    entity.addComponent(
      'Draw',
      new DrawComponent({
        entity,
        child: {
          sprite: parseAnimation(vineDefinition.sprite),
          state: 'Root0',
        },
      })
    )
    entity.addComponent('Vine', new VineComponent(entity, 0))

    addTag(entity)

    return entity
  }
}