import { Entity } from '@core/ecs/entity'
import { airTankAI } from '@game/ai/entity/airTank/airTankAI'
import { AiComponent } from '@game/components/aiComponent'
import { ObjectEntityFactory } from '../../objectEntityFactory'

export default class AirTankFactory extends ObjectEntityFactory {
  public create(): Entity {
    const entity = super.create()

    entity.addComponent('Ai', new AiComponent(airTankAI(entity, this.world)))

    return entity
  }
}
