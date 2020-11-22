import { Entity } from '@core/ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '@game/components/positionComponent'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { ColliderComponent, AABBDef } from '@game/components/colliderComponent'
import { PlayerComponent } from '@game/components/playerComponent'
import { Vec2 } from '@core/math/vec2'
import { CategoryList } from './category'
import { HorizontalDirectionComponent } from '@game/components/directionComponent'
import { AirHolderComponent } from '@game/components/airHolderComponent'
import { HPComponent } from '@game/components/hpComponent'
import { InvincibleComponent } from '@game/components/invincibleComponent'
import { AIComponent } from '@game/components/aiComponent'
import { parseAnimation } from '@core/graphics/animationParser'
import { CameraComponent } from '@game/components/cameraComponent'
import { AnimationStateComponent } from '@game/components/animationStateComponent'
import playerDefinition from '@res/animation/player.json'
import { World } from '@core/ecs/world'
import { playerAI } from '@game/ai/entity/player/playerAI'

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
  readonly FOOT_CLIP_TOLERANCE_Y = 0
  readonly CLIP_TOLERANCE_X = (this.WIDTH - this.FOOT_WIDTH) / 2 + this.FOOT_CLIP_TOLERANCE_X
  readonly CLIP_TOLERANCE_Y = 4
  readonly INITIAL_AIR_QUANTITY = 100
  readonly MAX_AIR_QUANTITY = 100
  readonly AIR_COLLECT_SPEED = 0.05
  readonly AIR_CONSUME_SPEED = 0.025

  public constructor(private world: World) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()
    const position = new PositionComponent(200, 100)
    const body = new RigidBodyComponent(this.MASS, new Vec2(), new Vec2(), this.RESTITUTION)
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

    const aabbBody = new AABBDef(new Vec2(this.WIDTH, this.HEIGHT), CategoryList.player.body)
    aabbBody.offset = new Vec2(this.OFFSET_X, this.OFFSET_Y)
    aabbBody.maxClipTolerance = new Vec2(this.CLIP_TOLERANCE_X, this.CLIP_TOLERANCE_Y)
    collider.createCollider(aabbBody)

    const hitBox = new AABBDef(new Vec2(this.WIDTH, this.HEIGHT), CategoryList.player.hitBox)
    hitBox.offset = new Vec2(this.OFFSET_X, this.OFFSET_Y)
    hitBox.maxClipTolerance = new Vec2(this.CLIP_TOLERANCE_X, this.CLIP_TOLERANCE_Y)
    collider.createCollider(hitBox)

    const sensor = new AABBDef(new Vec2(this.WIDTH, this.HEIGHT), CategoryList.player.sensor)
    sensor.tag.add('airHolderBody')
    sensor.tag.add('playerSensor')
    sensor.offset = new Vec2(this.OFFSET_X, this.OFFSET_Y)
    sensor.maxClipTolerance = new Vec2(this.CLIP_TOLERANCE_X, this.CLIP_TOLERANCE_Y)
    collider.createCollider(sensor)

    const foot = new AABBDef(new Vec2(this.FOOT_WIDTH, this.FOOT_HEIGHT), CategoryList.player.foot)
    foot.tag.add('playerFoot')
    foot.offset = new Vec2(this.OFFSET_X + this.FOOT_OFFSET_X, this.OFFSET_Y + this.FOOT_OFFSET_Y)
    foot.maxClipTolerance = new Vec2(this.FOOT_CLIP_TOLERANCE_X, this.FOOT_CLIP_TOLERANCE_Y)
    foot.isSensor = true
    collider.createCollider(foot)

    const sprite = parseAnimation(playerDefinition.sprite)
    const draw = new DrawComponent(entity)
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
    animState.changeIsVisible.addObserver(x => sprite.setVisible(x))

    const ai = new AIComponent(playerAI(entity, this.world))

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
