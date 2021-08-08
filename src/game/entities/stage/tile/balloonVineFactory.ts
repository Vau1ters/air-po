import { Entity } from '@core/ecs/entity'
import { balloonVineAI } from '@game/ai/entity/balloonVine/balloonVineAI'
import { AiComponent } from '@game/components/aiComponent'
import { InvincibleComponent } from '@game/components/invincibleComponent'
import { PickupTargetComponent } from '@game/components/pickupTargetComponent'
import { TileEntityFactory } from '@game/entities/tileEntityFactory'

export default class BalloonVineFactory extends TileEntityFactory {
  public create(): Entity {
    const entity = super.create()

    entity.addComponent('Ai', new AiComponent(balloonVineAI(entity, this.world)))

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
