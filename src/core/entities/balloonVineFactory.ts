import { EntityFactory } from './entityFactory'
import { Entity } from '../ecs/entity'
import { Family } from '../ecs/family'
import { PositionComponent } from '../components/positionComponent'
import { Vec2 } from '../math/vec2'
import { DrawComponent } from '../components/drawComponent'
import { ColliderComponent, AABBDef } from '../components/colliderComponent'
import { CategoryList } from './category'
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

    const aabbBody = new AABBDef(new Vec2(this.WIDTH, this.HEIGHT))
    aabbBody.tag.add('balloonVine')
    aabbBody.tag.add('airHolderBody')
    aabbBody.offset = new Vec2(this.OFFSET_X, this.OFFSET_Y)
    aabbBody.category = CategoryList.item.category
    aabbBody.mask = CategoryList.item.mask
    aabbBody.isSensor = true

    aabbBody.maxClipTolerance = new Vec2(this.CLIP_TOLERANCE_X, this.CLIP_TOLERANCE_Y)
    collider.createCollider(aabbBody)

    const sprite = parseSprite(balloonvineAIData.sprite)
    const enemyAI = parseAI(balloonvineAIData.ai)

    draw.addChild(sprite)

    const animState = new AnimationStateComponent()
    animState.changeState.addObserver(x => sprite.changeTo(x))

    const ai = new AIComponent(new BehaviourTree(enemyAI))

    entity.addComponent('AI', ai)
    entity.addComponent('Position', position)
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
