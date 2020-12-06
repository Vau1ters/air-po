import { Entity } from '@core/ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '@game/components/positionComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { ColliderComponent, AABBDef } from '@game/components/colliderComponent'
import { BulletComponent } from '@game/components/bulletComponent'
import { Vec2 } from '@core/math/vec2'
import { CategoryList } from './category'
import { AttackComponent } from '@game/components/attackComponent'
import ballBulletDefinition from '@res/animation/ballBullet.json'
import needleBulletDefinition from '@res/animation/needleBullet.json'
import { parseAnimation } from '@core/graphics/animationParser'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'

const bulletDefinition = {
  ball: ballBulletDefinition,
  needle: needleBulletDefinition,
}

type ShooterType = 'player' | 'enemy'
type BulletType = 'ball' | 'needle'

export class BulletFactory extends EntityFactory {
  readonly HIT_BOX_WIDTH = 4
  readonly HIT_BOX_HEIGHT = 4

  readonly ATTACK_HIT_BOX_WIDTH = 4
  readonly ATTACK_HIT_BOX_HEIGHT = 4

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
    const position = new PositionComponent(
      shooterPosition.x - (direction.x * this.offset.x) / 2,
      shooterPosition.y + this.offset.y
    )
    const bullet = new BulletComponent(this.life)
    const collider = new ColliderComponent(entity)

    const aabbBody = new AABBDef(
      new Vec2(this.HIT_BOX_WIDTH, this.HIT_BOX_HEIGHT),
      CategoryList.bulletBody
    )
    aabbBody.tag.add('bulletBody')
    aabbBody.offset = new Vec2(-this.HIT_BOX_WIDTH / 2, -this.ATTACK_HIT_BOX_HEIGHT / 2)
    aabbBody.maxClipTolerance = new Vec2(0, 0)
    aabbBody.isSensor = true
    collider.createCollider(aabbBody)

    // 攻撃判定
    const attack = new AttackComponent(1, this.shooter)

    const attackHitBox = new AABBDef(
      new Vec2(this.ATTACK_HIT_BOX_WIDTH, this.ATTACK_HIT_BOX_HEIGHT),
      this.shooterType === 'player' ? CategoryList.player.attack : CategoryList.enemy.attack
    )
    attackHitBox.tag.add('AttackHitBox')
    attackHitBox.offset = new Vec2(-this.ATTACK_HIT_BOX_WIDTH / 2, -this.ATTACK_HIT_BOX_HEIGHT / 2)
    attackHitBox.isSensor = true
    collider.createCollider(attackHitBox)

    const body = new RigidBodyComponent(
      0,
      new Vec2(direction.x * this.speed, direction.y * this.speed),
      new Vec2(),
      0,
      0
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

    entity.addComponent('Position', position)
    entity.addComponent('Draw', draw)
    entity.addComponent('Collider', collider)
    entity.addComponent('RigidBody', body)
    entity.addComponent('Bullet', bullet)
    entity.addComponent('Attack', attack)
    return entity
  }
}
