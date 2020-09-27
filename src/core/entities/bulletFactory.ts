import { Entity } from '../ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '../components/positionComponent'
import { DrawComponent } from '../components/drawComponent'
import { ColliderComponent, AABBDef } from '../components/colliderComponent'
import { BulletComponent } from '../components/bulletComponent'
import { Vec2 } from '../math/vec2'
import { CategoryList } from './category'
import { AttackComponent } from '../components/attackComponent'
import ballBulletDefinition from '../../../res/entities/ballBullet.json'
import needleBulletDefinition from '../../../res/entities/needleBullet.json'
import { parseSprite } from '../parser/spriteParser'

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
  public speed = 10
  public life?: number
  public offset: Vec2 = new Vec2(0, 0)
  public type: BulletType = 'ball'

  public setDirection(vector: Vec2): void {
    this.angle = Math.atan2(vector.y, vector.x)
  }

  public setRange(range: number): void {
    this.life = range / this.speed
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
    const draw = new DrawComponent()
    const bullet = new BulletComponent(
      new Vec2(direction.x * this.speed, direction.y * this.speed),
      this.life
    )
    const collider = new ColliderComponent(entity)

    const aabbBody = new AABBDef(new Vec2(this.HIT_BOX_WIDTH, this.HIT_BOX_HEIGHT))
    aabbBody.offset = new Vec2(-this.HIT_BOX_WIDTH / 2, -this.ATTACK_HIT_BOX_HEIGHT / 2)
    aabbBody.category = CategoryList.bulletBody.category
    aabbBody.mask = CategoryList.bulletBody.mask
    aabbBody.maxClipTolerance = new Vec2(0, 0)
    aabbBody.tag.add('bulletBody')
    collider.createCollider(aabbBody)

    // 攻撃判定
    const attack = new AttackComponent(1, this.shooter)

    const attackHitBox = new AABBDef(
      new Vec2(this.ATTACK_HIT_BOX_WIDTH, this.ATTACK_HIT_BOX_HEIGHT)
    )
    attackHitBox.offset = new Vec2(-this.ATTACK_HIT_BOX_WIDTH / 2, -this.ATTACK_HIT_BOX_HEIGHT / 2)
    attackHitBox.tag.add('AttackHitBox')
    if (this.shooterType === 'enemy') {
      attackHitBox.category = CategoryList.enemyAttack.category
      attackHitBox.mask = CategoryList.enemyAttack.mask
    } else if (this.shooterType === 'player') {
      attackHitBox.category = CategoryList.playerAttack.category
      attackHitBox.mask = CategoryList.playerAttack.mask
    }
    attackHitBox.isSensor = true
    collider.createCollider(attackHitBox)

    const sprite = parseSprite(bulletDefinition[this.type].sprite)
    const radAngle = (this.angle / Math.PI) * 180
    const index = Math.floor(((radAngle + 180 + 180 / 16) / 360) * 16) % 16
    const directions = [
      'Right',
      'RightDownUp',
      'RightDown',
      'RightDownDwon',
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

    draw.addChild(sprite)

    entity.addComponent('Position', position)
    entity.addComponent('Draw', draw)
    entity.addComponent('Collider', collider)
    entity.addComponent('Bullet', bullet)
    entity.addComponent('Attack', attack)
    return entity
  }
}
