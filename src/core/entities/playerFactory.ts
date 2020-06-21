import { Entity } from '../ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '../components/positionComponent'
import { RigidBodyComponent } from '../components/rigidBodyComponent'
import { DrawComponent } from '../components/drawComponent'
import { ColliderComponent, AABBDef } from '../components/colliderComponent'
import { PlayerComponent } from '../components/playerComponent'
import { Vec2 } from '../math/vec2'
import { CategoryList } from './category'
import { playerTextures } from '../graphics/art'
import { Animation } from '../graphics/animation'
import { HorizontalDirectionComponent } from '../components/directionComponent'
import { AirHolderComponent } from '../components/airHolderComponent'
import { HPComponent } from '../components/hpComponent'
import { InvincibleComponent } from '../components/invincibleComponent'
import { WhileNode } from '../ai/decorator/whileNode'
import { TrueNode } from '../ai/condition/boolNode'
import { IfNode } from '../ai/decorator/ifNode'
import { IsDeadNode } from '../ai/condition/isDeadNode'
import { SequenceNode } from '../ai/composite/sequenceNode'
import { AnimationNode } from '../ai/action/animationNode'
import { WaitNode } from '../ai/action/waitNode'
// import { AirEmitterNode } from '../ai/action/airEmitterNode'
import { DeathNode } from '../ai/action/deathNode'
import { BehaviourTree } from '../ai/behaviourTree'
import { AIComponent } from '../components/aiComponent'
import { PlayerGunShootNode } from '../ai/action/playerGunShootNode'
import { ParallelNode } from '../ai/composite/parallelNode'
// import { RemoveComponentNode } from '../ai/action/removeComponentNode'
import { CameraComponent } from '../components/cameraComponent'
import { AnimationStateComponent } from '../components/animationStateComponent'
import { PlayerMoveNode } from '../ai/action/playerMoveNode'

export class PlayerFactory extends EntityFactory {
  readonly MASS = 10
  readonly RESTITUTION = 0
  readonly WIDTH = 10
  readonly HEIGHT = 13
  readonly OFFSET_X = -5
  readonly OFFSET_Y = -6
  readonly FOOT_WIDTH = this.WIDTH - 2
  readonly FOOT_HEIGHT = 1
  readonly FOOT_OFFSET_X = 1
  readonly FOOT_OFFSET_Y = 13
  readonly FOOT_CLIP_TOLERANCE_X = 2
  readonly FOOT_CLIP_TOLERANCE_Y = 14
  readonly CLIP_TOLERANCE_X = (this.WIDTH - this.FOOT_WIDTH) / 2 + this.FOOT_CLIP_TOLERANCE_X
  readonly CLIP_TOLERANCE_Y = 4
  readonly INITIAL_AIR_QUANTITY = 1600
  readonly MAX_AIR_QUANTITY = 2000
  readonly AIR_COLLECT_SPEED = 2
  readonly AIR_CONSUME_SPEED = 1

  public create(): Entity {
    const entity = new Entity()
    const position = new PositionComponent(200, 100)
    const body = new RigidBodyComponent(this.MASS, new Vec2(), new Vec2(), this.RESTITUTION)
    const draw = new DrawComponent()
    const player = new PlayerComponent()
    const direction = new HorizontalDirectionComponent('Right')
    const collider = new ColliderComponent(entity)
    const airHolder = new AirHolderComponent({
      initialQuantity: this.INITIAL_AIR_QUANTITY,
      maxQuantity: this.MAX_AIR_QUANTITY,
      collectSpeed: this.AIR_COLLECT_SPEED,
      consumeSpeed: this.AIR_CONSUME_SPEED,
    })
    const hp = new HPComponent(3, 3)
    const invincible = new InvincibleComponent()

    // TODO: カメラをプレイヤーから分離する
    const camera = new CameraComponent()

    const aabbBody = new AABBDef(new Vec2(this.WIDTH, this.HEIGHT))
    aabbBody.tag.add('playerBody')
    aabbBody.tag.add('airHolderBody')
    aabbBody.offset = new Vec2(this.OFFSET_X, this.OFFSET_Y)
    aabbBody.category = CategoryList.playerBody.category
    aabbBody.mask = CategoryList.playerBody.mask
    aabbBody.maxClipTolerance = new Vec2(this.CLIP_TOLERANCE_X, this.CLIP_TOLERANCE_Y)
    collider.createCollider(aabbBody)

    const aabbFoot = new AABBDef(new Vec2(this.FOOT_WIDTH, this.FOOT_HEIGHT))
    aabbFoot.offset = new Vec2(
      this.OFFSET_X + this.FOOT_OFFSET_X,
      this.OFFSET_Y + this.FOOT_OFFSET_Y
    )
    aabbFoot.tag.add('playerFoot')
    aabbFoot.category = CategoryList.playerFoot.category
    aabbFoot.mask = CategoryList.playerFoot.mask
    aabbFoot.maxClipTolerance = new Vec2(this.FOOT_CLIP_TOLERANCE_X, this.FOOT_CLIP_TOLERANCE_Y)
    collider.createCollider(aabbFoot)

    const animatedTexture = {
      Standing: [playerTextures[0]],
      Walking: [playerTextures[0], playerTextures[1]],
      Jumping: [playerTextures[1]],
      Dying: [playerTextures[2]],
    }
    const sprite = new Animation(animatedTexture, 'Standing')
    draw.addChild(sprite)
    direction.changeDirection.addObserver(x => {
      if (x === 'Left') {
        sprite.scale.x = -1
      } else {
        sprite.scale.x = 1
      }
    })

    const animState = new AnimationStateComponent()
    animState.changeState.addObserver(x => sprite.changeTo(x))

    // AI
    const playerAI = new WhileNode(
      new TrueNode(),
      new IfNode(
        new IsDeadNode(),
        // 死んだときの処理
        new SequenceNode([
          new AnimationNode('Dying'),
          // new RemoveComponentNode('RigidBody'),
          new WaitNode(60),
          // new AirEmitterNode(10000),
          new DeathNode(),
        ]),
        // 生きているときの処理
        new ParallelNode([new PlayerGunShootNode(), new PlayerMoveNode()])
      )
    )
    const ai = new AIComponent(new BehaviourTree(playerAI))

    entity.addComponent('AI', ai)
    entity.addComponent('Position', position)
    entity.addComponent('RigidBody', body)
    entity.addComponent('HorizontalDirection', direction)
    entity.addComponent('HP', hp)
    entity.addComponent('Invincible', invincible)
    entity.addComponent('Draw', draw)
    entity.addComponent('Collider', collider)
    entity.addComponent('Player', player)
    entity.addComponent('AirHolder', airHolder)
    entity.addComponent('Camera', camera)
    entity.addComponent('AnimationState', animState)
    return entity
  }
}
