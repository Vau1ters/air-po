import { System } from '@core/ecs/system'
import { Entity } from '@core/ecs/entity'
import { Collider } from '@game/components/colliderComponent'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'

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

  private attackCollisionCallback = (
    attackerCollider: Collider,
    targetCollider: Collider
  ): void => {
    const attacker = attackerCollider.entity
    const target = targetCollider.entity

    const attack = attacker.getComponent('Attack')

    if (attack.ignoreList.includes(target)) return

    if (target.hasComponent('HP') === false) return
    const targetHP = target.getComponent('HP')

    if (target.hasComponent('Invincible')) {
      const invincible = target.getComponent('Invincible')
      if (invincible.isInvincible()) return
      invincible.setInvincible()
    } else {
      attack.ignoreList.push(target) // prevent double attack to non-invincible entity
    }
    targetHP.decrease(attack.damage)

    // if manually remove by adding callback to do it,
    // the order of call can influence the result
    // to ignore that, damage system also has a responsibility to remove entity
    if (attack.shouldCounterbalance) this.world.removeEntity(attacker)
  }
}
