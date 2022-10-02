import { System } from '@core/ecs/system'
import { Entity } from '@core/ecs/entity'
import { CollisionCallbackArgs } from '@game/components/colliderComponent'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { assert } from '@utils/assertion'

export const ATTACK_TAG = 'Attack'
export const HITBOX_TAG = 'HitBox'

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
      if (c.hasTag(ATTACK_TAG)) {
        assert(
          c.category === 'attack',
          `Collider with '${ATTACK_TAG}' tag must have ATTACK category`
        )
        assert(
          c.mask.has('playerHitbox') || c.mask.has('enemyHitbox'),
          `Collider with '${ATTACK_TAG}' tag must have HITBOX mask`
        )
        c.notifier.addObserver(this.attackCollisionCallback)
      }
    }
    assert(
      entity.hasComponent('Sound'),
      'Entity which has AttackComponent must have SoundComponent'
    )
  }

  private entityRemoved(entity: Entity): void {
    if (entity.hasComponent('Collider')) {
      const collider = entity.getComponent('Collider')
      for (const c of collider.colliders) {
        if (c.hasTag(ATTACK_TAG)) {
          c.notifier.removeObserver(this.attackCollisionCallback)
        }
      }
    }
  }

  private attackCollisionCallback = (args: CollisionCallbackArgs): void => {
    const {
      me: { entity: attacker },
      other: { entity: target },
    } = args

    const attack = attacker.getComponent('Attack')
    if (attack.damage === 0) return

    if (target.hasComponent('Hp') === false) return
    const targetHP = target.getComponent('Hp')

    if (target.hasComponent('Invincible')) {
      const invincible = target.getComponent('Invincible')
      if (invincible.isInvincible()) return
      invincible.setInvincible()
    }
    targetHP.decrease(attack.damage)

    if (target.getComponent('Collider').getByCategory('playerHitbox')) {
      attacker.getComponent('Sound').addSound('playerHit')
    } else if (target.getComponent('Collider').getByCategory('enemyHitbox')) {
      attacker.getComponent('Sound').addSound('enemyHit')
    } else {
      assert(false, 'this target does not have hitbox')
    }

    if (targetHP.hp <= 0) {
      target.getComponent('Collider').removeByTag(ATTACK_TAG)
      target.getComponent('Collider').removeByTag(HITBOX_TAG)
    }

    // if manually remove by adding callback to do it,
    // the order of call can influence the result
    // to ignore that, damage system also has a responsibility to remove entity
    if (attack.shouldCounterbalance) this.world.removeEntity(attacker)
  }
}
