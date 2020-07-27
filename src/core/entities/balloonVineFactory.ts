import { EntityFactory } from './entityFactory'
import { Entity } from '../ecs/entity'
import { Family } from '../ecs/family'
import { PositionComponent } from '../components/positionComponent'
import { RigidBodyComponent } from '../components/rigidBodyComponent'
import { Vec2 } from '../math/vec2'
import { DrawComponent } from '../components/drawComponent'
import { ColliderComponent, AABBDef } from '../components/colliderComponent'
import { CategorySet, Category } from './category'
import { HPComponent } from '../components/hpComponent'
import { InvincibleComponent } from '../components/invincibleComponent'
import { AIComponent } from '../components/aiComponent'
import { parseSprite } from '../parser/spriteParser'
import { AnimationStateComponent } from '../components/animationStateComponent'
import { PickupTargetComponent } from '../components/pickupTargetComponent'
import { PlayerPointerComponent } from '../components/playerPointerComponent'
import { AirHolderComponent } from '../components/airHolderComponent'
import { assert } from '../../utils/assertion'
import balloonvineDefinition from '../../../res/entities/balloonvine.json'
import { World } from '../ecs/world'
import { balloonvineAI } from '../ai/balloonvineAI'

export class BalloonVineFactory extends EntityFactory {
  private readonly BODY_WIDTH = 10
  private readonly BODY_HEIGHT = 13
  private readonly ROOT_WIDTH = 5
  private readonly ROOT_HEIGHT = 5
  private readonly WALL_WIDTH = 2
  private readonly WALL_HEIGHT = 10
  private readonly OFFSET_X = -5
  private readonly OFFSET_Y = -6
  private readonly CLIP_TOLERANCE_X = 2
  private readonly CLIP_TOLERANCE_Y = 2

  private readonly INITIAL_AIR_QUANTITY = 0
  private readonly MAX_AIR_QUANTITY = 10
  private readonly AIR_COLLECT_SPEED = 10
  private readonly AIR_CONSUME_SPEED = 0

  private readonly MASS = 0.0001
  private readonly RESTITUTION = 0

  constructor(private world: World, private playerFamily: Family) {
    super()
  }

  public create(): Entity {
    assert(this.playerFamily)
    const entity = new Entity()
    const position = new PositionComponent(0, 0)
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

    const gripAABB = new AABBDef(new Vec2(0, 0))
    gripAABB.tag.add('balloonVine')
    gripAABB.category = Category.DEFAULT
    gripAABB.mask = new CategorySet(Category.PLAYER)
    gripAABB.maxClipTolerance = new Vec2(this.CLIP_TOLERANCE_X, this.CLIP_TOLERANCE_Y)
    gripAABB.isSensor = true
    collider.createCollider(gripAABB)

    const bodyAABB = new AABBDef(new Vec2(this.BODY_WIDTH, this.BODY_HEIGHT))
    bodyAABB.tag.add('balloonVine')
    bodyAABB.tag.add('airHolderBody')
    bodyAABB.offset = new Vec2(this.OFFSET_X, this.OFFSET_Y)
    bodyAABB.category = Category.DEFAULT
    bodyAABB.mask = new CategorySet(Category.AIR, Category.DEFAULT)
    bodyAABB.maxClipTolerance = new Vec2(this.CLIP_TOLERANCE_X, this.CLIP_TOLERANCE_Y)
    bodyAABB.isSensor = true
    collider.createCollider(bodyAABB)

    const rootAABB = new AABBDef(new Vec2(this.ROOT_WIDTH, this.ROOT_HEIGHT))
    rootAABB.tag.add('balloonVine')
    rootAABB.category = Category.DEFAULT
    rootAABB.mask = new CategorySet(Category.WALL)
    rootAABB.maxClipTolerance = new Vec2(0, 0)
    rootAABB.isSensor = false
    collider.createCollider(rootAABB)

    const wallAABB = new AABBDef(new Vec2(this.WALL_WIDTH, this.WALL_HEIGHT))
    wallAABB.tag.add('balloonVine')
    wallAABB.category = Category.DEFAULT
    wallAABB.mask = new CategorySet(Category.WALL)
    wallAABB.maxClipTolerance = new Vec2(0, 0)
    wallAABB.isSensor = true
    collider.createCollider(wallAABB)

    const sprite = parseSprite(balloonvineDefinition.sprite)

    draw.addChild(sprite)

    const animState = new AnimationStateComponent()
    animState.changeState.addObserver(x => sprite.changeTo(x))

    const ai = new AIComponent(balloonvineAI(entity, this.world))

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
}
