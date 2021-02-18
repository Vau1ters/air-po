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
import slime1Definition from '@res/animation/slime1.json'
import { World } from '@core/ecs/world'
import { slime1AI } from '@game/ai/entity/slime1/slime1AI'

export class Slime1Factory extends EntityFactory {
  readonly MASS = 10
  readonly RESTITUTION = 0
  readonly WIDTH = 10
  readonly HEIGHT = 13
  readonly OFFSET_X = -5
  readonly OFFSET_Y = -6
  readonly CLIP_TOLERANCE_X = 2
  readonly CLIP_TOLERANCE_Y = 2

  readonly ATTACK_HIT_BOX_WIDTH = 10
  readonly ATTACK_HIT_BOX_HEIGHT = 13
  readonly ATTACK_HIT_BOX_OFFSET_X = -5
  readonly ATTACK_HIT_BOX_OFFSET_Y = -6

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
        .setAABB({
          offset: new Vec2(this.OFFSET_X, this.OFFSET_Y),
          size: new Vec2(this.WIDTH, this.HEIGHT),
          maxClipToTolerance: new Vec2(this.CLIP_TOLERANCE_X, this.CLIP_TOLERANCE_Y),
        })
        .setCategory(CategoryList.enemy.body)
        .build(),
      new ColliderBuilder()
        .setEntity(entity)
        .setAABB({
          offset: new Vec2(this.OFFSET_X, this.OFFSET_Y),
          size: new Vec2(this.WIDTH, this.HEIGHT),
          maxClipToTolerance: new Vec2(this.CLIP_TOLERANCE_X, this.CLIP_TOLERANCE_Y),
        })
        .setCategory(CategoryList.enemy.hitBox)
        .setIsSensor(true)
        .build(),
      new ColliderBuilder()
        .setEntity(entity)
        .setAABB({
          offset: new Vec2(this.ATTACK_HIT_BOX_OFFSET_X, this.ATTACK_HIT_BOX_OFFSET_Y),
          size: new Vec2(this.ATTACK_HIT_BOX_WIDTH, this.ATTACK_HIT_BOX_HEIGHT),
        })
        .setCategory(CategoryList.enemy.attack)
        .addTag('AttackHitBox')
        .setIsSensor(true)
        .build()
    )

    const sprite = parseAnimation(slime1Definition.sprite)
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

    const ai = new AIComponent(slime1AI(entity, this.world))

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
