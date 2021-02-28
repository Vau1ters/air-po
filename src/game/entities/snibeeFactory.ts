import { EntityFactory } from './entityFactory'
import { Entity } from '@core/ecs/entity'
import { PositionComponent } from '@game/components/positionComponent'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'
import { Vec2 } from '@core/math/vec2'
import { DrawComponent } from '@game/components/drawComponent'
import { HorizontalDirectionComponent } from '@game/components/directionComponent'
import { buildColliders, ColliderComponent } from '@game/components/colliderComponent'
import { Category, CategorySet } from './category'
import { AttackComponent } from '@game/components/attackComponent'
import { HPComponent } from '@game/components/hpComponent'
import { AIComponent } from '@game/components/aiComponent'
import { parseAnimation } from '@core/graphics/animationParser'
import { AnimationStateComponent } from '@game/components/animationStateComponent'
import snibeeDefinition from '@res/animation/snibee.json'
import { World } from '@core/ecs/world'
import { snibeeAI, SnibeeSetting } from '@game/ai/entity/snibee/snibeeAI'

export class SnibeeFactory extends EntityFactory {
  private readonly BODY_COLLIDER = {
    type: 'AABB' as const,
    offset: new Vec2(-5, -6),
    size: new Vec2(10, 13),
    maxClipToTolerance: new Vec2(SnibeeSetting.maxVelocity / 60, SnibeeSetting.maxVelocity / 60),
  }

  private readonly HIT_BOX_COLLIDER = {
    type: 'AABB' as const,
    offset: new Vec2(-5, -6),
    size: new Vec2(10, 13),
  }

  private readonly RIGID_BODY = {
    mass: 10,
  }

  public constructor(private world: World) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()
    const direction = new HorizontalDirectionComponent('Right')

    const sprite = parseAnimation(snibeeDefinition.sprite)
    const draw = new DrawComponent(entity)
    draw.addChild(sprite)
    direction.changeDirection.addObserver(x => {
      if (x === 'Left') {
        sprite.scale.x = -1
      } else {
        sprite.scale.x = 1
      }
    })

    entity.addComponent('AI', new AIComponent(snibeeAI(entity, this.world)))
    entity.addComponent('Position', new PositionComponent())
    entity.addComponent('RigidBody', new RigidBodyComponent(this.RIGID_BODY))
    entity.addComponent('HorizontalDirection', direction)
    entity.addComponent('Draw', draw)
    entity.addComponent(
      'Collider',
      new ColliderComponent(
        ...buildColliders({
          entity,
          colliders: [
            {
              geometry: this.BODY_COLLIDER,
              category: Category.PHYSICS,
              mask: new CategorySet(Category.STATIC_WALL, Category.DYNAMIC_WALL),
              tag: ['snibeeBody'],
            },
            {
              geometry: this.BODY_COLLIDER,
              category: Category.HITBOX,
              mask: new CategorySet(Category.ATTACK, Category.SENSOR),
              tag: ['snibeeBody'],
              isSensor: true,
            },
            {
              geometry: this.HIT_BOX_COLLIDER,
              category: Category.ATTACK,
              mask: new CategorySet(Category.PLAYER_HITBOX),
              tag: ['AttackHitBox'],
              isSensor: true,
            },
          ],
        })
      )
    )
    entity.addComponent('Attack', new AttackComponent(1, false))
    entity.addComponent('HP', new HPComponent(2, 2))
    entity.addComponent('AnimationState', new AnimationStateComponent(sprite))
    return entity
  }
}
