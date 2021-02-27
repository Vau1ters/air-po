import { Entity } from '@core/ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '@game/components/positionComponent'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { ColliderComponent, Collider, ColliderBuilder } from '@game/components/colliderComponent'
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
import { EquipmentComponent } from '@game/components/equipmentComponent'

export class PlayerFactory extends EntityFactory {
  private readonly MASS = 10
  private readonly RESTITUTION = 0

  private readonly BODY_AABB = {
    offset: new Vec2(-5, -6),
    size: new Vec2(10, 13),
    maxClipToTolerance: new Vec2(3, 4),
  }
  private readonly FOOT_AABB = {
    offset: new Vec2(-4, 7),
    size: new Vec2(8, 1),
    maxClipToTolerance: new Vec2(2, 0),
  }

  private readonly AIR_COLLECT_SPEED = 0.05
  private readonly AIR_CONSUME_SPEED = 0.025

  public constructor(private world: World) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()
    const position = new PositionComponent(200, 100)
    const body = new RigidBodyComponent(this.MASS, new Vec2(), new Vec2(), this.RESTITUTION)
    const player = new PlayerComponent()
    const direction = new HorizontalDirectionComponent('Right')
    const airHolder = new AirHolderComponent({
      initialQuantity: 0,
      maxQuantity: 0,
      collectSpeed: this.AIR_COLLECT_SPEED,
      consumeSpeed: this.AIR_CONSUME_SPEED,
    })
    const hp = new HPComponent(3, 3)
    const invincible = new InvincibleComponent()

    const equipment = new EquipmentComponent()
    equipment.equipEvent.addObserver(type => {
      if (type === 'AirTank') {
        equipment.airTank.count += 1
        airHolder.maxQuantity += equipment.airTank.quantity
        airHolder.quantity += equipment.airTank.quantity
      }
    })
    // 初期状態で空気タンクを2つ追加しておく
    equipment.equipEvent.notify('AirTank')
    equipment.equipEvent.notify('AirTank')

    // TODO: カメラをプレイヤーから分離する
    const camera = new CameraComponent()

    const shouldCollide = (me: Collider, other: Collider): boolean => {
      if (player.throughFloorIgnoreCount > 0 && other.tag.has('throughFloor')) return false
      return true
    }

    const collider = new ColliderComponent()
    collider.colliders.push(
      new ColliderBuilder()
        .setEntity(entity)
        .setAABB(this.BODY_AABB)
        .setCategory(CategoryList.player.body)
        .setShouldCollide(shouldCollide)
        .build(),
      new ColliderBuilder()
        .setEntity(entity)
        .setAABB(this.BODY_AABB)
        .setCategory(CategoryList.player.hitBox)
        .build(),
      new ColliderBuilder()
        .setEntity(entity)
        .setAABB(this.BODY_AABB)
        .setCategory(CategoryList.player.sensor)
        .addTag('airHolderBody')
        .addTag('playerSensor')
        .build(),
      new ColliderBuilder()
        .setEntity(entity)
        .setAABB(this.FOOT_AABB)
        .setCategory(CategoryList.player.foot)
        .addTag('playerFoot')
        .setIsSensor(true)
        .setShouldCollide(shouldCollide)
        .build()
    )

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

    const animState = new AnimationStateComponent(sprite)

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
    entity.addComponent('Equipment', equipment)
    entity.addComponent('Camera', camera)
    entity.addComponent('AnimationState', animState)
    return entity
  }
}
