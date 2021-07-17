import { Entity } from '@core/ecs/entity'
import { balloonVineAI } from '@game/ai/entity/balloonVine/balloonVineAI'
import { AIComponent } from '@game/components/aiComponent'
import { HPComponent } from '@game/components/hpComponent'
import { InvincibleComponent } from '@game/components/invincibleComponent'
import { PickupTargetComponent } from '@game/components/pickupTargetComponent'
import { TileEntityFactory } from './tileEntityFactory'

export class BalloonVineFactory extends TileEntityFactory {
  public create(): Entity {
    const entity = super.create()

    entity.addComponent('AI', new AIComponent(balloonVineAI(entity, this.world)))

    entity.addComponent('HP', new HPComponent(1, 1))
    entity.addComponent('Invincible', new InvincibleComponent())
    entity.addComponent('PickupTarget', new PickupTargetComponent(false))

    for (const c of entity
      .getComponent('Collider')
      .colliders.filter(c => c.category === 'enemyHitbox')) {
      c.condition = (): boolean => entity.getComponent('PickupTarget').isPossessed === false
    }
    if (this.frame === 1) {
      const airHolder = entity.getComponent('AirHolder')
      airHolder.quantity = airHolder.maxQuantity
    }
    return entity
  }
}
