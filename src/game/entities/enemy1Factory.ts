import { EntityFactory } from './entityFactory'
import { Entity } from '@core/ecs/entity'
import { PositionComponent } from '@game/components/positionComponent'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'
import { Vec2 } from '@core/math/vec2'
import { DrawComponent } from '@game/components/drawComponent'
import { HorizontalDirectionComponent } from '@game/components/directionComponent'
import { ColliderComponent, ColliderBuilder } from '@game/components/colliderComponent'
import { CategoryList } from './category'
import { AttackComponent } from '@game/components/attackComponent'
import { HPComponent } from '@game/components/hpComponent'
import { AIComponent } from '@game/components/aiComponent'
import { parseAnimation } from '@core/graphics/animationParser'
import { AnimationStateComponent } from '@game/components/animationStateComponent'
import enemy1Definition from '@res/animation/enemy1.json'
import { World } from '@core/ecs/world'
import { enemy1AI } from '@game/ai/entity/enemy1/enemy1AI'

export class Enemy1Factory extends EntityFactory {
  private readonly MASS = 10
  private readonly RESTITUTION = 0

  private readonly BODY_AABB = {
    offset: new Vec2(-5, -6),
    size: new Vec2(10, 13),
    maxClipToTolerance: new Vec2(2, 2),
  }

  private readonly HIT_BOX_AABB = {
    offset: new Vec2(-5, -6),
    size: new Vec2(10, 13),
    maxClipToTolerance: new Vec2(2, 2),
  }

  public constructor(private world: World) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()
    const position = new PositionComponent(200, 100)
    const body = new RigidBodyComponent(this.MASS, new Vec2(), new Vec2(), this.RESTITUTION, 1)
    const direction = new HorizontalDirectionComponent('Right')
    const hp = new HPComponent(2, 2)

    const collider = new ColliderComponent()
    collider.colliders.push(
      new ColliderBuilder()
        .setEntity(entity)
        .setAABB(this.BODY_AABB)
        .setCategory(CategoryList.enemy.body)
        .addTag('enemy1Body')
        .build(),
      new ColliderBuilder()
        .setEntity(entity)
        .setAABB(this.BODY_AABB)
        .setCategory(CategoryList.enemy.hitBox)
        .addTag('enemy1Body')
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

    const sprite = parseAnimation(enemy1Definition.sprite)
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

    const ai = new AIComponent(enemy1AI(entity, this.world))

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
