import { EntityFactory } from './entityFactory'
import { Entity } from '@core/ecs/entity'
import { PositionComponent } from '@game/components/positionComponent'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'
import { Vec2 } from '@core/math/vec2'
import { DrawComponent } from '@game/components/drawComponent'
import { HorizontalDirectionComponent } from '@game/components/directionComponent'
import { ColliderBuilder, ColliderComponent } from '@game/components/colliderComponent'
import { CategoryList } from './category'
import { AttackComponent } from '@game/components/attackComponent'
import { HPComponent } from '@game/components/hpComponent'
import { AIComponent } from '@game/components/aiComponent'
import { parseAnimation } from '@core/graphics/animationParser'
import { AnimationStateComponent } from '@game/components/animationStateComponent'
import snibeeDefinition from '@res/animation/snibee.json'
import { World } from '@core/ecs/world'
import { snibeeAI, SnibeeSetting } from '@game/ai/entity/snibee/snibeeAI'

export class SnibeeFactory extends EntityFactory {
  private readonly MASS = 10
  private readonly RESTITUTION = 0
  readonly WIDTH = 10
  readonly HEIGHT = 13
  readonly OFFSET_X = -5
  readonly OFFSET_Y = -6

  readonly ATTACK_HIT_BOX_WIDTH = 10
  readonly ATTACK_HIT_BOX_HEIGHT = 13
  readonly ATTACK_HIT_BOX_OFFSET_X = -5
  readonly ATTACK_HIT_BOX_OFFSET_Y = -6

  private readonly BODY_AABB = {
    offset: new Vec2(-5, -6),
    size: new Vec2(10, 13),
    maxClipToTolerance: new Vec2(SnibeeSetting.maxVelocity / 60, SnibeeSetting.maxVelocity / 60),
  }
  private readonly HIT_BOX_AABB = {
    offset: new Vec2(-5, -6),
    size: new Vec2(10, 13),
  }

  public constructor(private world: World) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()
    const position = new PositionComponent(200, 100)
    const body = new RigidBodyComponent(this.MASS, new Vec2(), new Vec2(), this.RESTITUTION, 0)
    const direction = new HorizontalDirectionComponent('Right')
    const collider = new ColliderComponent()
    const hp = new HPComponent(2, 2)

    collider.colliders.push(
      new ColliderBuilder()
        .setEntity(entity)
        .setAABB(this.BODY_AABB)
        .setCategory(CategoryList.enemy.body)
        .addTag('snibeeBody')
        .build(),
      new ColliderBuilder()
        .setEntity(entity)
        .setAABB(this.BODY_AABB)
        .setCategory(CategoryList.enemy.hitBox)
        .addTag('snibeeBody')
        .setIsSensor(true)
        .build(),
      new ColliderBuilder()
        .setEntity(entity)
        .setAABB(this.HIT_BOX_AABB)
        .setCategory(CategoryList.enemy.attack)
        .addTag('AttackHitBox')
        .setIsSensor(true)
        .build()
    )

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

    const animState = new AnimationStateComponent(sprite)

    const ai = new AIComponent(snibeeAI(entity, this.world))

    entity.addComponent('AI', ai)
    entity.addComponent('Position', position)
    entity.addComponent('RigidBody', body)
    entity.addComponent('HorizontalDirection', direction)
    entity.addComponent('Draw', draw)
    entity.addComponent('Collider', collider)
    entity.addComponent('Attack', new AttackComponent(1, false))
    entity.addComponent('HP', hp)
    entity.addComponent('AnimationState', animState)
    return entity
  }
}
