import { EntityFactory } from './entityFactory'
import { Entity } from '@core/ecs/entity'
import { PositionComponent } from '@game/components/positionComponent'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'
import { Vec2 } from '@core/math/vec2'
import { DrawComponent } from '@game/components/drawComponent'
import { buildColliders, ColliderComponent } from '@game/components/colliderComponent'
import { Category, CategorySet } from './category'
import { HPComponent } from '@game/components/hpComponent'
import { InvincibleComponent } from '@game/components/invincibleComponent'
import { AIComponent } from '@game/components/aiComponent'
import { parseAnimation } from '@core/graphics/animationParser'
import { AnimationStateComponent } from '@game/components/animationStateComponent'
import { PickupTargetComponent } from '@game/components/pickupTargetComponent'
import { AirHolderComponent } from '@game/components/airHolderComponent'
import balloonvineDefinition from '@res/animation/balloonvine.json'
import { World } from '@core/ecs/world'
import { balloonvineAI } from '@game/ai/entity/balloonVine/balloonVineAI'

export class BalloonVineFactory extends EntityFactory {
  private readonly GRIP_COLLIDER = {
    type: 'AABB' as const,
    maxClipToTolerance: new Vec2(2, 2),
  }

  private readonly BODY_COLLIDER = {
    type: 'AABB' as const,
    offset: new Vec2(-5, -6),
    size: new Vec2(10, 13),
    maxClipToTolerance: new Vec2(2, 2),
  }

  private readonly ROOT_COLLIDER = {
    type: 'AABB' as const,
    size: new Vec2(5, 5),
  }

  private readonly WALL_COLLIDER = {
    type: 'AABB' as const,
    size: new Vec2(2, 10),
  }

  private readonly AIR_HOLDER = {
    initialQuantity: 0,
    maxQuantity: 10,
    collectSpeed: 10,
    consumeSpeed: 0,
  }

  private readonly RIGID_BODY = {
    mass: 0.0001,
    gravityScale: 1,
  }

  constructor(private world: World) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()

    const sprite = parseAnimation(balloonvineDefinition.sprite)
    sprite.zIndex = 1
    const draw = new DrawComponent(entity)
    draw.sortableChildren = true
    draw.addChild(sprite)

    entity.addComponent('AI', new AIComponent(balloonvineAI(entity, this.world)))
    entity.addComponent('Position', new PositionComponent())
    entity.addComponent('RigidBody', new RigidBodyComponent(this.RIGID_BODY))
    entity.addComponent('Draw', draw)
    entity.addComponent(
      'Collider',
      new ColliderComponent(
        ...buildColliders({
          entity,
          colliders: [
            {
              geometry: this.GRIP_COLLIDER,
              category: Category.ITEM,
              mask: new CategorySet(Category.SENSOR),
              tag: ['balloonVine'],
              isSensor: true,
            },
            {
              geometry: this.BODY_COLLIDER,
              category: Category.HITBOX,
              mask: new CategorySet(Category.ATTACK, Category.SENSOR),
              tag: ['balloonVine'],
              isSensor: true,
            },
            {
              geometry: this.BODY_COLLIDER,
              category: Category.SENSOR,
              mask: new CategorySet(Category.AIR),
              tag: ['airHolderBody'],
              isSensor: true,
            },
            {
              geometry: this.ROOT_COLLIDER,
              category: Category.PHYSICS,
              mask: new CategorySet(Category.STATIC_WALL, Category.DYNAMIC_WALL, Category.PHYSICS),
              tag: ['balloonVine'],
              isSensor: true,
            },
            {
              geometry: this.WALL_COLLIDER,
              category: Category.SENSOR,
              mask: new CategorySet(Category.STATIC_WALL, Category.DYNAMIC_WALL),
              tag: ['balloonVine'],
              isSensor: true,
            },
          ],
        })
      )
    )

    entity.addComponent('HP', new HPComponent(1, 1))
    entity.addComponent('Invincible', new InvincibleComponent())
    entity.addComponent('PickupTarget', new PickupTargetComponent(false))
    entity.addComponent('AnimationState', new AnimationStateComponent(sprite))
    entity.addComponent('AirHolder', new AirHolderComponent(this.AIR_HOLDER))
    return entity
  }
}
