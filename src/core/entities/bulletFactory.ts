import { Entity } from '../ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '../components/positionComponent'
import { DrawComponent } from '../components/drawComponent'
import { ColliderComponent, AABBDef } from '../components/colliderComponent'
import { BulletComponent } from '../components/bulletComponent'
import { Vec2 } from '../math/vec2'
import { CategoryList } from './category'
import { Graphics } from 'pixi.js'
import { AttackComponent } from '../components/attackComponent'

export class BulletFactory extends EntityFactory {
  readonly WIDTH = 10
  readonly HEIGHT = 3

  readonly ATTACK_HIT_BOX_WIDTH = 10
  readonly ATTACK_HIT_BOX_HEIGHT = 3

  public shooter?: Entity
  public angle = 0
  public speed = 10
  public life?: number
  public offset: Vec2 = new Vec2(0, 0)

  public setDirection(vector: Vec2): void {
    this.angle = Math.atan2(vector.y, vector.x)
  }

  public setRange(range: number): void {
    this.life = range / this.speed
  }

  public create(): Entity {
    if (!this.shooter) {
      console.log('player is not defined')
      return new Entity()
    }
    const playerPosition = this.shooter.getComponent('Position')

    const direction = new Vec2(Math.cos(this.angle), Math.sin(this.angle))

    const entity = new Entity()
    const position = new PositionComponent(
      playerPosition.x - this.WIDTH / 2 + (direction.x * (this.WIDTH + this.offset.x)) / 2,
      playerPosition.y + this.offset.y
    )
    const draw = new DrawComponent()
    const bullet = new BulletComponent(
      new Vec2(direction.x * this.speed, direction.y * this.speed),
      this.life
    )
    const collider = new ColliderComponent(entity)

    const aabbBody = new AABBDef(new Vec2(this.WIDTH, this.HEIGHT))
    aabbBody.offset = new Vec2(0, 0)
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
    attackHitBox.tag.add('AttackHitBox')
    attackHitBox.category = CategoryList.bulletAttack.category
    attackHitBox.mask = CategoryList.bulletAttack.mask
    attackHitBox.isSensor = true
    collider.createCollider(attackHitBox)

    const graphics = new Graphics()
    graphics.beginFill(0x00ff00)
    graphics.drawRect(0, 0, this.WIDTH, this.HEIGHT)
    draw.addChild(graphics)

    entity.addComponent('Position', position)
    entity.addComponent('Draw', draw)
    entity.addComponent('Collider', collider)
    entity.addComponent('Bullet', bullet)
    entity.addComponent('Attack', attack)
    return entity
  }
}
