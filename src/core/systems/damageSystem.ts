import { System } from '../ecs/system'
import { Entity } from '../ecs/entity'
import { Collider } from '../components/colliderComponent'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'

export class DamageSystem extends System {
  private family: Family

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('Attack', 'Collider').build()
    this.family.entityAddedEvent.addObserver((entity: Entity) => this.entityAdded(entity))
    this.family.entityRemovedEvent.addObserver((entity: Entity) => this.entityRemoved(entity))
  }

  public update(): void {
    // 何もしない
  }

  private entityAdded(entity: Entity): void {
    const collider = entity.getComponent('Collider')
    for (const c of collider.colliders) {
      if (c.tag.has('AttackHitBox')) {
        c.callbacks.add(this.attackCollisionCallback)
      }
    }
  }

  private entityRemoved(entity: Entity): void {
    if (entity.hasComponent('Collider')) {
      const collider = entity.getComponent('Collider')
      for (const c of collider.colliders) {
        if (c.tag.has('AttackHitBox')) {
          c.callbacks.delete(this.attackCollisionCallback)
        }
      }
    }
  }

  private attackCollisionCallback = (hitbox: Collider, other: Collider): void => {
    // AttackComponent持ってるEntityのColliderComponentと
    // HPComponentとInvincibleComponent持ちEntityとの衝突を見てHPを減らす
    const entity = other.entity

    if (entity.hasComponent('HP') && entity.hasComponent('Invincible')) {
      const hp = entity.getComponent('HP')
      const invincible = entity.getComponent('Invincible')
      const attack = hitbox.entity.getComponent('Attack')
      if (!invincible.isInvincible() && attack.entity !== entity) {
        hp.hp = Math.max(0, hp.hp - attack.damage)
        invincible.setInvincible()
      }
    }
  }
}
