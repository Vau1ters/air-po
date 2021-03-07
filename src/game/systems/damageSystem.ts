import { System } from '@core/ecs/system'
import { Entity } from '@core/ecs/entity'
import { CollisionCallbackArgs } from '@game/components/colliderComponent'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { Category } from '@game/entities/category'
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
      if (c.tag.has(ATTACK_TAG)) {
        assert(
          c.category === Category.ATTACK,
          `Collider with '${ATTACK_TAG}' tag must have ATTACK category`
        )
        assert(
          c.mask.has(Category.PLAYER_HITBOX) || c.mask.has(Category.ENEMY_HITBOX),
          `Collider with '${ATTACK_TAG}' tag must have HITBOX mask`
        )
        c.callbacks.add(this.attackCollisionCallback)
      }
    }
  }

  private entityRemoved(entity: Entity): void {
    if (entity.hasComponent('Collider')) {
      const collider = entity.getComponent('Collider')
      for (const c of collider.colliders) {
        if (c.tag.has(ATTACK_TAG)) {
          c.callbacks.delete(this.attackCollisionCallback)
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

    if (target.hasComponent('HP') === false) return
    const targetHP = target.getComponent('HP')

    if (target.hasComponent('Invincible')) {
      const invincible = target.getComponent('Invincible')
      if (invincible.isInvincible()) return
      invincible.setInvincible()
    }
    targetHP.decrease(attack.damage)

    // if manually remove by adding callback to do it,
    // the order of call can influence the result
    // to ignore that, damage system also has a responsibility to remove entity
    if (attack.shouldCounterbalance) this.world.removeEntity(attacker)
  }
}
