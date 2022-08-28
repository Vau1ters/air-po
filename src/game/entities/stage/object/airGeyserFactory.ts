import { Entity } from '@core/ecs/entity'
import { airGeyserAI } from '@game/ai/entity/airGeyser/airGeyserAI'
import { AiComponent } from '@game/components/aiComponent'
import { AirComponent } from '@game/components/airComponent'
import { NameComponent } from '@game/components/nameComponent'
import { ObjectEntityFactory } from '../../objectEntityFactory'

export default class AirGeyserFactory extends ObjectEntityFactory {
  public create(): Entity {
    const maxQuantity =
      (this.findProperty('float', 'maxQuantity') ?? 120) / AirComponent.QUANTITY_RADIUS_RATE
    const increaseRate = this.findProperty('float', 'increaseRate') ?? 0.2

    const entity = super.create()

    entity.addComponent('Name', new NameComponent('airGayser'))
    entity.addComponent(
      'Ai',
      new AiComponent(entity, {
        behaviour: airGeyserAI(entity, this.world, {
          maxQuantity,
          increaseRate,
        }),
        dependency: {
          after: ['AirHolderSystem:update'],
        },
      })
    )
    return entity
  }
}
