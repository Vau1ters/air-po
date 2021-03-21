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
import { PHYSICS_TAG } from '@game/systems/physicsSystem'
import { ATTACK_TAG } from '@game/systems/damageSystem'

export class SnibeeFactory extends EntityFactory {
  private readonly BODY_COLLIDER = {
    type: 'AABB' as const,
    size: new Vec2(10, 13),
    maxClipToTolerance: new Vec2(SnibeeSetting.maxVelocity / 60, SnibeeSetting.maxVelocity / 60),
  }

  private readonly HIT_BOX_COLLIDER = {
    type: 'AABB' as const,
    size: new Vec2(10, 13),
  }

  private readonly RIGID_BODY = {
    mass: 10,
    airResistance: 0.5,
  }

  public constructor(private world: World) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()

    entity.addComponent('AI', new AIComponent(snibeeAI(entity, this.world)))
    entity.addComponent('Position', new PositionComponent())
    entity.addComponent('RigidBody', new RigidBodyComponent(this.RIGID_BODY))
    entity.addComponent(
      'Draw',
      new DrawComponent({
        entity,
        child: {
          sprite: parseAnimation(snibeeDefinition.sprite),
        },
      })
    )
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
    entity.addComponent('AnimationState', new AnimationStateComponent(entity))
    entity.addComponent('HorizontalDirection', new HorizontalDirectionComponent(entity, 'Right'))
    return entity
  }
}
