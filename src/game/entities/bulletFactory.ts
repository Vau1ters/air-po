import { Entity } from '@core/ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '@game/components/positionComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { BulletComponent } from '@game/components/bulletComponent'
import { Vec2 } from '@core/math/vec2'
import { AttackComponent } from '@game/components/attackComponent'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'
import { createSprite, SpriteName } from '@core/graphics/art'
import { assert } from '@utils/assertion'
import { loadEntity } from './loader/EntityLoader'

const bulletDefinition: { [keys in BulletType]: SpriteName } = {
  ball: 'ballBullet',
  needle: 'needleBullet',
}
type ShooterType = 'player' | 'enemy'
type BulletType = 'ball' | 'needle'

export class BulletFactory extends EntityFactory {
  private readonly COLLIDER = {
    type: 'AABB' as const,
    size: new Vec2(0, 0),
  }
  private readonly PLAYER_ATTACK_COLLIDER = {
    type: 'AABB' as const,
    size: new Vec2(8, 8),
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
    assert(this.shooter !== undefined, 'shooter is not defined')

    const shooterPosition = this.shooter.getComponent('Position')

    const direction = new Vec2(Math.cos(this.angle), Math.sin(this.angle))

    const entity = loadEntity(this.shooterType === 'player' ? 'playerBullet' : 'enemyBullet')

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

    entity.addComponent(
      'Position',
      new PositionComponent(
        shooterPosition.x - (direction.x * this.offset.x) / 2,
        shooterPosition.y + this.offset.y
      )
    )
    entity.addComponent(
      'Draw',
      new DrawComponent({
        entity,
        child: {
          sprite: createSprite(bulletDefinition[this.type]),
          state: directions[index],
        },
      })
    )
    entity.addComponent(
      'RigidBody',
      new RigidBodyComponent({ velocity: direction.mul(this.speed) })
    )
    entity.addComponent('Bullet', new BulletComponent(this.life))
    entity.addComponent('Attack', new AttackComponent(1, true))
    return entity
  }
}
