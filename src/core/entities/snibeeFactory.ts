import { EntityFactory } from './entityFactory'
import { Entity } from '../ecs/entity'
import { PositionComponent } from '../components/positionComponent'
import { RigidBodyComponent } from '../components/rigidBodyComponent'
import { Vec2 } from '../math/vec2'
import { DrawComponent } from '../components/drawComponent'
import { HorizontalDirectionComponent } from '../components/directionComponent'
import { ColliderComponent, AABBDef } from '../components/colliderComponent'
import { CategoryList } from './category'
import { AttackComponent } from '../components/attackComponent'
import { HPComponent } from '../components/hpComponent'
import { InvincibleComponent } from '../components/invincibleComponent'
import { AIComponent } from '../components/aiComponent'
import { parseSprite } from '../parser/spriteParser'
import { AnimationStateComponent } from '../components/animationStateComponent'
import snibeeDefinition from '../../../res/entities/snibee.json'
import { World } from '../ecs/world'
import { snibeeAI, SnibeeSetting } from '../ai/snibeeAI'

export class SnibeeFactory extends EntityFactory {
  readonly MASS = 10
  readonly RESTITUTION = 0
  readonly WIDTH = 10
  readonly HEIGHT = 13
  readonly OFFSET_X = -5
  readonly OFFSET_Y = -6
  readonly CLIP_TOLERANCE_X = SnibeeSetting.maxVelocity / 60
  readonly CLIP_TOLERANCE_Y = SnibeeSetting.maxVelocity / 60

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
    const body = new RigidBodyComponent(this.MASS, new Vec2(), new Vec2(), this.RESTITUTION, 0)
    const direction = new HorizontalDirectionComponent('Right')
    const collider = new ColliderComponent(entity)
    const hp = new HPComponent(2, 2)
    const invincible = new InvincibleComponent()

    const aabbBody = new AABBDef(new Vec2(this.WIDTH, this.HEIGHT), CategoryList.enemy.body)
    aabbBody.tag.add('snibeeBody')
    aabbBody.offset = new Vec2(this.OFFSET_X, this.OFFSET_Y)
    aabbBody.maxClipTolerance = new Vec2(this.CLIP_TOLERANCE_X, this.CLIP_TOLERANCE_Y)
    collider.createCollider(aabbBody)

    const hitBox = new AABBDef(new Vec2(this.WIDTH, this.HEIGHT), CategoryList.enemy.hitBox)
    hitBox.tag.add('snibeeBody')
    hitBox.offset = new Vec2(this.OFFSET_X, this.OFFSET_Y)
    hitBox.maxClipTolerance = new Vec2(this.CLIP_TOLERANCE_X, this.CLIP_TOLERANCE_Y)
    hitBox.isSensor = true
    collider.createCollider(hitBox)

    // 攻撃判定
    const attack = new AttackComponent(1, entity)

    const attackHitBox = new AABBDef(
      new Vec2(this.ATTACK_HIT_BOX_WIDTH, this.ATTACK_HIT_BOX_HEIGHT),
      CategoryList.enemy.attack
    )
    attackHitBox.tag.add('AttackHitBox')
    attackHitBox.offset = new Vec2(this.ATTACK_HIT_BOX_OFFSET_X, this.ATTACK_HIT_BOX_OFFSET_Y)
    attackHitBox.isSensor = true
    collider.createCollider(attackHitBox)

    const sprite = parseSprite(snibeeDefinition.sprite)
    const draw = new DrawComponent(entity, sprite)
    direction.changeDirection.addObserver(x => {
      if (x === 'Left') {
        sprite.scale.x = -1
      } else {
        sprite.scale.x = 1
      }
    })

    const animState = new AnimationStateComponent()
    animState.changeState.addObserver(x => sprite.changeTo(x))

    const ai = new AIComponent(snibeeAI(entity, this.world))

    entity.addComponent('AI', ai)
    entity.addComponent('Position', position)
    entity.addComponent('RigidBody', body)
    entity.addComponent('HorizontalDirection', direction)
    entity.addComponent('Draw', draw)
    entity.addComponent('Collider', collider)
    entity.addComponent('Attack', attack)
    entity.addComponent('Invincible', invincible)
    entity.addComponent('HP', hp)
    entity.addComponent('AnimationState', animState)
    return entity
  }
}
