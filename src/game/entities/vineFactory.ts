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

export class VineFactory extends EntityFactory {
  private readonly BODY_COLLIDER = {
    type: 'AABB' as const,
    offset: new Vec2(-8, -8),
    size: new Vec2(16, 16),
  }

  private readonly WALL_SENSOR_COLLIDER = {
    type: 'AABB' as const,
    offset: new Vec2(-7, 0),
    size: new Vec2(14, 5),
  }

  private readonly AIR_SENSOR_COLLIDER = {
    type: 'AABB' as const,
    offset: new Vec2(-3, -3),
    size: new Vec2(6, 6),
  }

  public constructor() {
    super()
  }

  public create(): Entity {
    const entity = new Entity()

    const sprite = parseAnimation(vineDefinition.sprite)
    sprite.changeTo('Root0')
    const draw = new DrawComponent(entity)
    draw.addChild(sprite)

    const vine = new VineComponent(0)
    vine.sprites.push(sprite)

    entity.addComponent(
      'Collider',
      new ColliderComponent(
        ...buildColliders({
          entity,
          colliders: [
            {
              geometry: this.BODY_COLLIDER,
              category: Category.DYNAMIC_WALL,
              mask: new CategorySet(Category.PHYSICS, Category.SENSOR),
              tag: ['vine'],
            },
            {
              geometry: this.WALL_SENSOR_COLLIDER,
              category: Category.SENSOR,
              mask: new CategorySet(Category.STATIC_WALL, Category.DYNAMIC_WALL),
              tag: ['vineWallSensor'],
              isSensor: true,
            },
            {
              geometry: this.AIR_SENSOR_COLLIDER,
              category: Category.SENSOR,
              mask: new CategorySet(Category.AIR),
              tag: ['vineAirSensor'],
              isSensor: true,
            },
          ],
        })
      )
    )
    entity.addComponent('AI', new AIComponent(vineAI(entity)))
    entity.addComponent('RigidBody', new RigidBodyComponent())
    entity.addComponent('Position', new PositionComponent())
    entity.addComponent('Draw', draw)
    entity.addComponent('Vine', vine)

    addTag(entity)

    return entity
  }
}
