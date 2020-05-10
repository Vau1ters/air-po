import { System } from '../ecs/system'
import { Entity } from '../ecs/entity'
import { ColliderComponent, Collider } from '../components/colliderComponent'
import { InvincibleComponent } from '../components/invincibleComponent'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'

export class DamageSystem extends System {
  private family: Family

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('Attack', 'Collider').build()
    this.family.entityAddedEvent.addObserver((entity: Entity) =>
      this.entityAdded(entity)
    )
    this.family.entityRemovedEvent.addObserver((entity: Entity) =>
      this.entityRemoved(entity)
    )
  }

  public update(): void {
    // 何もしない
  }

  private entityAdded(entity: Entity): void {
    const collider = entity.getComponent('Collider')
    if (collider) {
      for (const c of collider.colliders) {
        if (c.tag === 'AttackHitBox') {
          c.callback = this.attackCollisionCallback
        }
      }
    }
  }

  private entityRemoved(entity: Entity): void {
    if (entity.hasComponent('Collider')) {
      const collider = entity.getComponent('Collider') as ColliderComponent
      for (const c of collider.colliders) {
        if (c.tag === 'AttackHitBox') {
          c.callback = null
        }
      }
    }
  }

  private attackCollisionCallback(hitbox: Collider, other: Collider): void {
    // AttackComponent持ってるEntityのColliderComponentと
    // HPComponentとInvincibleComponent持ちEntityとの衝突を見てHPを減らす
    const entity = other.component.entity
    const hp = entity.getComponent('HP')
    const invincible = entity.getComponent('Invincible')
    const attack = hitbox.component.entity.getComponent('Attack')
    if (hp && invincible && attack && !invincible.isInvincible()) {
      hp.hp -= attack.damage
      invincible.invincibleTime = InvincibleComponent.INVINCIBLE_TIME
    }
  }
}
