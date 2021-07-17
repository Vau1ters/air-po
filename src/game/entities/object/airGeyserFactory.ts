import { Entity } from '@core/ecs/entity'
import { airGeyserAI } from '@game/ai/entity/airGeyser/airGeyserAI'
import { AIComponent } from '@game/components/aiComponent'
import { ObjectEntityFactory } from './objectEntityFactory'

export class AirGeyserFactory extends ObjectEntityFactory {
  public create(): Entity {
    const maxQuantity =
      (this.object.properties?.find(property => property.name === 'maxQuantity')
        ?.value as number) ?? 120
    const increaseRate =
      (this.object.properties?.find(property => property.name === 'increaseRate')
        ?.value as number) ?? 0.2

    const entity = super.create()

    entity.addComponent(
      'AI',
      new AIComponent({
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
