import { Entity } from '../ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '../components/positionComponent'
import { HorizontalDirectionComponent } from '../components/directionComponent'
import { DrawComponent } from '../components/drawComponent'
import { ColliderComponent, AABBDef } from '../components/colliderComponent'
import { PlayerComponent } from '../components/playerComponent'
import { BulletComponent } from '../components/bulletComponent'
import { Vec2 } from '../math/vec2'
import { CategoryList } from './category'
import { Graphics } from 'pixi.js'
import { AttackComponent } from '../components/attackComponent'

export class BulletFactory extends EntityFactory {
  readonly WIDTH = 10
  readonly HEIGHT = 3
  readonly SPEED = 10

  readonly ATTACK_HIT_BOX_WIDTH = 10
  readonly ATTACK_HIT_BOX_HEIGHT = 3

  public player?: Entity

  public create(): Entity {
    if (!this.player) {
      console.log('player is not defined')
      return new Entity()
    }
    const player = this.player.getComponent('Player') as PlayerComponent
    const playerPosition = this.player.getComponent('Position') as PositionComponent
    const playerDirection = this.player.getComponent(
      'HorizontalDirection'
    ) as HorizontalDirectionComponent

    const direction = new Vec2(
      (playerDirection.looking == 'Left' ? -1 : +1) *
        Math.cos((player.bulletAngle * Math.PI) / 180),
      Math.sin((player.bulletAngle * Math.PI) / 180)
    )

    const entity = new Entity()
    const position = new PositionComponent(playerPosition.x, playerPosition.y)
    const draw = new DrawComponent()
    const bullet = new BulletComponent(new Vec2(direction.x * this.SPEED, direction.y * this.SPEED))
    const collider = new ColliderComponent(entity)

    const aabbBody = new AABBDef(new Vec2(this.WIDTH, this.HEIGHT))
    aabbBody.offset = new Vec2(0, 0)
    aabbBody.category = CategoryList.bulletBody.category
    aabbBody.mask = CategoryList.bulletBody.mask
    aabbBody.maxClipTolerance = new Vec2(0, 0)
    aabbBody.tag = 'bulletBody'
    collider.createCollider(aabbBody)

    // 攻撃判定
    const attack = new AttackComponent(1, this.player)

    const attackHitBox = new AABBDef(
      new Vec2(this.ATTACK_HIT_BOX_WIDTH, this.ATTACK_HIT_BOX_HEIGHT)
    )
    attackHitBox.tag = 'AttackHitBox'
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
