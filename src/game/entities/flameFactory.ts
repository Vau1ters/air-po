import { Entity } from '@core/ecs/entity'
import { EntityFactory } from './entityFactory'
import { ShooterType } from './bulletFactory'
import { Vec2 } from '@core/math/vec2'
import { PositionComponent } from '@game/components/positionComponent'
import { FlameComponent } from '@game/components/flameComponent'
import { AABBDef, ColliderComponent } from '@game/components/colliderComponent'
import { CategoryList } from './category'
import { AttackComponent } from '@game/components/attackComponent'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'
import { AIComponent } from '@game/components/aiComponent'
import { flameAI } from '@game/ai/entity/flame/flameAI'
import { World } from '@core/ecs/world'
import { DrawComponent } from '@game/components/drawComponent'

export class FlameFactory extends EntityFactory {
  private SPEED = 300
  private GRAVITY_SCALE = -0.1
  private FLAME_BODY_SIZE = 6

  public shooter?: Entity
  public shooterType: ShooterType = 'player'
  public angle = 0

  public constructor(private world: World) {
    super()
  }

  public setDirection(vector: Vec2): void {
    this.angle = Math.atan2(vector.y, vector.x)
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
    const position = new PositionComponent(shooterPosition.x, shooterPosition.y)
    const flame = new FlameComponent()
    const collider = new ColliderComponent(entity)
    const body = new RigidBodyComponent(
      1,
      direction.mul(this.SPEED),
      new Vec2(),
      0,
      this.GRAVITY_SCALE
    )
    const ai = new AIComponent(flameAI(entity, this.world))

    const draw = new DrawComponent(entity)
    draw.addChild(flame.graphic)

    const aabbBody = new AABBDef(
      new Vec2(this.FLAME_BODY_SIZE, this.FLAME_BODY_SIZE),
      CategoryList.bulletBody
    )
    aabbBody.tag.add('FlameBody')
    aabbBody.offset = new Vec2(-this.FLAME_BODY_SIZE / 2, -this.FLAME_BODY_SIZE / 2)
    aabbBody.maxClipTolerance = new Vec2(0, 0)
    collider.createCollider(aabbBody)

    // 攻撃判定
    const attack = new AttackComponent(1, false)

    const attackHitBox = new AABBDef(
      new Vec2(flame.size, flame.size),
      this.shooterType === 'player' ? CategoryList.player.attack : CategoryList.enemy.attack
    )
    attackHitBox.tag.add('AttackHitBox')
    attackHitBox.offset = new Vec2(-flame.size / 2, -flame.size / 2)
    attackHitBox.isSensor = true
    collider.createCollider(attackHitBox)

    entity.addComponent('Position', position)
    entity.addComponent('Collider', collider)
    entity.addComponent('AI', ai)
    entity.addComponent('Flame', flame)
    entity.addComponent('Draw', draw)
    entity.addComponent('RigidBody', body)
    entity.addComponent('Attack', attack)
    return entity
  }
}
