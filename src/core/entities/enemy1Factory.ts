import { EntityFactory } from './entityFactory'
import { Entity } from '../ecs/entity'
import { PositionComponent } from '../components/positionComponent'
import { RigidBodyComponent } from '../components/rigidBodyComponent'
import { Vec2 } from '../math/vec2'
import { DrawComponent } from '../components/drawComponent'
import { HorizontalDirectionComponent } from '../components/directionComponent'
import { ColliderComponent, AABBDef } from '../components/colliderComponent'
import { enemy1Textures } from '../graphics/art'
import { Animation } from '../graphics/animation'
import { CategoryList } from './category'
import { AttackComponent } from '../components/attackComponent'
import { HPComponent } from '../components/hpComponent'
import { InvincibleComponent } from '../components/invincibleComponent'
import { WhileNode } from '../ai/decorator/whileNode'
import { TrueNode } from '../ai/condition/boolNode'
import { IfNode } from '../ai/decorator/ifNode'
import { AnimationNode } from '../ai/action/animationNode'
import { SequenceNode } from '../ai/composite/sequenceNode'
import { MoveNode, Direction } from '../ai/action/moveNode'
import { BehaviourTree } from '../ai/behaviourTree'
import { AIComponent } from '../components/aiComponent'
import { IsDeadNode } from '../ai/condition/isDeadNode'
import { WaitNode } from '../ai/action/waitNode'
import { DeathNode } from '../ai/action/deathNode'
import { AirEmitterNode } from '../ai/action/airEmitterNode'

export class Enemy1Factory extends EntityFactory {
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

  public create(): Entity {
    const entity = new Entity()
    const position = new PositionComponent(200, 100)
    const body = new RigidBodyComponent(
      this.MASS,
      new Vec2(),
      new Vec2(),
      this.RESTITUTION,
      0
    )
    const draw = new DrawComponent()
    const direction = new HorizontalDirectionComponent('Right')
    const collider = new ColliderComponent(entity)
    const hp = new HPComponent(2)
    const invincible = new InvincibleComponent()

    const aabbBody = new AABBDef(new Vec2(this.WIDTH, this.HEIGHT))
    aabbBody.tag = 'enemy1Body'
    aabbBody.offset = new Vec2(this.OFFSET_X, this.OFFSET_Y)
    aabbBody.category = CategoryList.enemy1Body.category
    aabbBody.mask = CategoryList.enemy1Body.mask

    aabbBody.maxClipTolerance = new Vec2(
      this.CLIP_TOLERANCE_X,
      this.CLIP_TOLERANCE_Y
    )
    collider.createCollider(aabbBody)

    // 攻撃判定
    const attack = new AttackComponent(1, entity)

    const attackHitBox = new AABBDef(
      new Vec2(this.ATTACK_HIT_BOX_WIDTH, this.ATTACK_HIT_BOX_HEIGHT)
    )
    attackHitBox.tag = 'AttackHitBox'
    attackHitBox.offset = new Vec2(
      this.ATTACK_HIT_BOX_OFFSET_X,
      this.ATTACK_HIT_BOX_OFFSET_Y
    )
    attackHitBox.category = CategoryList.enemy1Attack.category
    attackHitBox.mask = CategoryList.enemy1Attack.mask
    attackHitBox.isSensor = true
    collider.createCollider(attackHitBox)

    const animatedTexture = {
      Floating: [enemy1Textures[0], enemy1Textures[1]],
      Dying: [enemy1Textures[2]],
    }
    const sprite = new Animation(animatedTexture, 'Floating')
    draw.addChild(sprite)
    direction.changeDirection.addObserver(x => {
      if (x === 'Left') {
        sprite.scale.x = -1
      } else {
        sprite.scale.x = 1
      }
    })

    const enemyAI = new WhileNode(
      new TrueNode(),
      new IfNode(
        new IsDeadNode(),
        new SequenceNode([
          new AnimationNode(sprite, 'Dying'),
          new WaitNode(60),
          new AirEmitterNode(10000),
          new DeathNode(),
        ]),
        new SequenceNode([
          new MoveNode(Direction.Right, 2, 60),
          new MoveNode(Direction.Left, 2, 60),
        ])
      )
    )
    const ai = new AIComponent(new BehaviourTree(enemyAI))

    entity.addComponent('AI', ai)
    entity.addComponent('Position', position)
    entity.addComponent('RigidBody', body)
    entity.addComponent('HorizontalDirection', direction)
    entity.addComponent('Draw', draw)
    entity.addComponent('Collider', collider)
    entity.addComponent('Attack', attack)
    entity.addComponent('Invincible', invincible)
    entity.addComponent('HP', hp)
    return entity
  }
}
