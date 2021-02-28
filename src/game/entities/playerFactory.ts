import { Entity } from '@core/ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '@game/components/positionComponent'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { ColliderComponent, Collider, buildColliders } from '@game/components/colliderComponent'
import { PlayerComponent } from '@game/components/playerComponent'
import { Vec2 } from '@core/math/vec2'
import { Category, CategorySet } from './category'
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
  private readonly BODY_COLLIDER = {
    type: 'AABB' as const,
    offset: new Vec2(-5, -6),
    size: new Vec2(10, 13),
    maxClipToTolerance: new Vec2(3, 4),
  }

  private readonly FOOT_COLLIDER = {
    type: 'AABB' as const,
    offset: new Vec2(-4, 7),
    size: new Vec2(8, 1),
    maxClipToTolerance: new Vec2(2, 0),
  }

  private readonly RIGID_BODY = {
    mass: 10,
    gravityScale: 1,
  }

  private readonly AIR_HOLDER = {
    initialQuantity: 0,
    maxQuantity: 0,
    collectSpeed: 0.05,
    consumeSpeed: 0.025,
  }

  public constructor(private world: World) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()
    const player = new PlayerComponent()
    const direction = new HorizontalDirectionComponent('Right')
    const airHolder = new AirHolderComponent(this.AIR_HOLDER)

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

    const shouldCollide = (me: Collider, other: Collider): boolean => {
      if (player.throughFloorIgnoreCount > 0 && other.tag.has('throughFloor')) return false
      return true
    }

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

    entity.addComponent('AI', new AIComponent(playerAI(entity, this.world)))
    entity.addComponent('Position', new PositionComponent())
    entity.addComponent('RigidBody', new RigidBodyComponent(this.RIGID_BODY))
    entity.addComponent('HorizontalDirection', direction)
    entity.addComponent('HP', new HPComponent(3, 3))
    entity.addComponent('Invincible', new InvincibleComponent())
    entity.addComponent('Draw', draw)
    entity.addComponent(
      'Collider',
      new ColliderComponent(
        ...buildColliders({
          entity,
          colliders: [
            {
              geometry: this.BODY_COLLIDER,
              category: Category.PHYSICS,
              mask: new CategorySet(Category.STATIC_WALL, Category.DYNAMIC_WALL),
              condition: shouldCollide,
            },
            {
              geometry: this.BODY_COLLIDER,
              category: Category.PLAYER_HITBOX,
              mask: new CategorySet(Category.ATTACK, Category.SENSOR),
            },
            {
              geometry: this.BODY_COLLIDER,
              category: Category.SENSOR,
              mask: new CategorySet(Category.ITEM, Category.AIR, Category.SENSOR),
              tag: ['airHolderBody', 'playerSensor'],
            },
            {
              geometry: this.FOOT_COLLIDER,
              category: Category.PHYSICS,
              mask: new CategorySet(Category.STATIC_WALL, Category.DYNAMIC_WALL),
              tag: ['playerFoot'],
              isSensor: true,
              condition: shouldCollide,
            },
          ],
        })
      )
    )
    entity.addComponent('Player', player)
    entity.addComponent('AirHolder', airHolder)
    entity.addComponent('Equipment', equipment)
    // TODO: カメラをプレイヤーから分離する
    entity.addComponent('Camera', new CameraComponent())
    entity.addComponent('AnimationState', new AnimationStateComponent(sprite))
    return entity
  }
}
