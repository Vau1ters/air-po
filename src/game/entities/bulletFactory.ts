import { Entity } from '@core/ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '@game/components/positionComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { BulletComponent } from '@game/components/bulletComponent'
import { Vec2 } from '@core/math/vec2'
import { Category, CategorySet } from './category'
import { AttackComponent } from '@game/components/attackComponent'
import ballBulletDefinition from '@res/animation/ballBullet.json'
import needleBulletDefinition from '@res/animation/needleBullet.json'
import { parseAnimation } from '@core/graphics/animationParser'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'
import { ColliderComponent, buildColliders } from '@game/components/colliderComponent'

const bulletDefinition = {
  ball: ballBulletDefinition,
  needle: needleBulletDefinition,
}

type ShooterType = 'player' | 'enemy'
type BulletType = 'ball' | 'needle'

export class BulletFactory extends EntityFactory {
  private readonly COLLIDER = {
    type: 'AABB' as const,
    offset: new Vec2(-2, -2),
    size: new Vec2(4, 4),
  }

  public shooter?: Entity
  public shooterType: ShooterType = 'player'
  public angle = 0
  public speed = 600
  public life?: number
  public offset: Vec2 = new Vec2(0, 0)
  public type: BulletType = 'ball'

  public setDirection(vector: Vec2): void {
    this.angle = Math.atan2(vector.y, vector.x)
  }

  public setRange(range: number): void {
    this.life = (range / this.speed) * 60
  }

  public setShooter(shooter: Entity, shooterType: ShooterType): void {
    this.shooter = shooter
    this.shooterType = shooterType
  }

  public create(): Entity {
    if (!this.shooter) {
      console.log('shooter is not defined')
      return new Entity()
    }
    const shooterPosition = this.shooter.getComponent('Position')

    const direction = new Vec2(Math.cos(this.angle), Math.sin(this.angle))

    const entity = new Entity()

    const collider = new ColliderComponent()
    collider.colliders.push(
      ...buildColliders({
        entity,
        colliders: [
          {
            geometry: this.COLLIDER,
            category: Category.PHYSICS,
            mask: new CategorySet(Category.STATIC_WALL, Category.DYNAMIC_WALL),
            tag: ['bulletBody'],
            isSensor: true,
          },
          {
            geometry: this.COLLIDER,
            category: Category.ATTACK,
            mask: new CategorySet(
              this.shooterType === 'player' ? Category.HITBOX : Category.PLAYER_HITBOX
            ),
            tag: ['AttackHitBox'],
            isSensor: true,
          },
        ],
      })
    )

    const sprite = parseAnimation(bulletDefinition[this.type].sprite)
    const radAngle = (this.angle / Math.PI) * 180
    const index = Math.floor(((radAngle + 360 + 180 / 16) / 360) * 16) % 16
    const directions = [
      'Right',
      'RightDownUp',
      'RightDown',
      'RightDownDown',
      'Down',
      'LeftDownDown',
      'LeftDown',
      'LeftDownUp',
      'Left',
      'LeftUpDown',
      'LeftUp',
      'LeftUpUp',
      'Up',
      'RightUpUp',
      'RightUp',
      'RightUpDown',
    ]
    sprite.changeTo(directions[index])

    const draw = new DrawComponent(entity)
    draw.addChild(sprite)

    entity.addComponent(
      'Position',
      new PositionComponent(
        shooterPosition.x - (direction.x * this.offset.x) / 2,
        shooterPosition.y + this.offset.y
      )
    )
    entity.addComponent('Draw', draw)
    entity.addComponent('Collider', collider)
    entity.addComponent(
      'RigidBody',
      new RigidBodyComponent({ velocity: direction.mul(this.speed) })
    )
    entity.addComponent('Bullet', new BulletComponent(this.life))
    entity.addComponent('Attack', new AttackComponent(1, true))
    return entity
  }
}
