import { EntityFactory } from './entityFactory'
import { Entity } from '../ecs/entity'
import { Family } from '../ecs/family'
import { PositionComponent } from '../components/positionComponent'
import { RigidBodyComponent } from '../components/rigidBodyComponent'
import { Vec2 } from '../math/vec2'
import { DrawComponent } from '../components/drawComponent'
import { ColliderComponent, AABBDef } from '../components/colliderComponent'
import { CategoryList, CategorySet, Category } from './category'
import { HPComponent } from '../components/hpComponent'
import { InvincibleComponent } from '../components/invincibleComponent'
import { BehaviourTree } from '../ai/behaviourTree'
import { AIComponent } from '../components/aiComponent'
import { parseAI } from '../parser/aiParser'
import { parseSprite } from '../parser/spriteParser'
import { AnimationStateComponent } from '../components/animationStateComponent'
import { PickupTargetComponent } from '../components/pickupTargetComponent'
import { PlayerPointerComponent } from '../components/playerPointerComponent'
import { AirHolderComponent } from '../components/airHolderComponent'
import { assert } from '../../utils/assertion'
import balloonvineAIData from '../../../res/balloonvineai.json'

export class BalloonVineFactory extends EntityFactory {
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
  readonly INITIAL_AIR_QUANTITY = 0
  readonly MAX_AIR_QUANTITY = 10
  readonly AIR_COLLECT_SPEED = 10
  readonly AIR_CONSUME_SPEED = 0

  readonly MASS = 0.0001
  readonly RESTITUTION = 0

  private playerFamily?: Family

  public create(): Entity {
    assert(this.playerFamily)
    const entity = new Entity()
    const position = new PositionComponent(200, 100)
    const draw = new DrawComponent()
    const collider = new ColliderComponent(entity)
    const hp = new HPComponent(1, 1)
    const invincible = new InvincibleComponent()
    const airHolder = new AirHolderComponent({
      initialQuantity: this.INITIAL_AIR_QUANTITY,
      maxQuantity: this.MAX_AIR_QUANTITY,
      collectSpeed: this.AIR_COLLECT_SPEED,
      consumeSpeed: this.AIR_CONSUME_SPEED,
    })
    const pickup = new PickupTargetComponent(false)
    const playerPointer = new PlayerPointerComponent(this.playerFamily)

    const body = new RigidBodyComponent(this.MASS, new Vec2(), new Vec2(), this.RESTITUTION)

    const gripAABB = new AABBDef(new Vec2(this.WIDTH, this.HEIGHT))
    gripAABB.tag.add('balloonVine')
    gripAABB.offset = new Vec2(this.OFFSET_X, this.OFFSET_Y)
    gripAABB.category = CategoryList.item.category
    gripAABB.mask = new CategorySet(Category.PLAYER)
    gripAABB.maxClipTolerance = new Vec2(this.CLIP_TOLERANCE_X, this.CLIP_TOLERANCE_Y)
    gripAABB.isSensor = true
    collider.createCollider(gripAABB)

    const bodyAABB = new AABBDef(new Vec2(this.WIDTH, this.HEIGHT))
    bodyAABB.tag.add('balloonVine')
    bodyAABB.tag.add('airHolderBody')
    bodyAABB.offset = new Vec2(this.OFFSET_X, this.OFFSET_Y)
    bodyAABB.category = CategoryList.item.category
    bodyAABB.mask = new CategorySet(Category.AIR, Category.DEFAULT)
    bodyAABB.maxClipTolerance = new Vec2(this.CLIP_TOLERANCE_X, this.CLIP_TOLERANCE_Y)
    bodyAABB.isSensor = true
    collider.createCollider(bodyAABB)

    const rootAABB = new AABBDef(new Vec2(5, 5))
    rootAABB.tag.add('balloonVine')
    rootAABB.offset = new Vec2(this.OFFSET_X, this.OFFSET_Y + 8)
    rootAABB.category = CategoryList.item.category
    rootAABB.mask = new CategorySet(Category.WALL)
    rootAABB.maxClipTolerance = new Vec2(0, 0)
    rootAABB.isSensor = false
    collider.createCollider(rootAABB)

    const wallAABB = new AABBDef(new Vec2(2, 10))
    wallAABB.tag.add('balloonVine')
    wallAABB.offset = new Vec2(-1, 0)
    wallAABB.category = CategoryList.item.category
    wallAABB.mask = new CategorySet(Category.WALL)
    wallAABB.maxClipTolerance = new Vec2(0, 0)
    wallAABB.isSensor = true
    collider.createCollider(wallAABB)

    const sprite = parseSprite(balloonvineAIData.sprite)
    const enemyAI = parseAI(balloonvineAIData.ai)

    draw.addChild(sprite)

    const animState = new AnimationStateComponent()
    animState.changeState.addObserver(x => sprite.changeTo(x))

    const ai = new AIComponent(new BehaviourTree(enemyAI))

    entity.addComponent('AI', ai)
    entity.addComponent('Position', position)
    entity.addComponent('RigidBody', body)
    entity.addComponent('Draw', draw)
    entity.addComponent('Collider', collider)
    entity.addComponent('HP', hp)
    entity.addComponent('Invincible', invincible)
    entity.addComponent('PickupTarget', pickup)
    entity.addComponent('AnimationState', animState)
    entity.addComponent('PlayerPointer', playerPointer)
    entity.addComponent('AirHolder', airHolder)
    return entity
  }

  setPlayerFamily(playerFamily: Family): BalloonVineFactory {
    this.playerFamily = playerFamily
    return this
  }
}
