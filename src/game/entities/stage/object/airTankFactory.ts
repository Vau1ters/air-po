import { Entity } from '@core/ecs/entity'
import { airTankAI } from '@game/ai/entity/airTank/airTankAI'
import { AiComponent } from '@game/components/aiComponent'
import { NameComponent } from '@game/components/nameComponent'
import { ObjectEntityFactory } from '../../objectEntityFactory'

export default class AirTankFactory extends ObjectEntityFactory {
  public create(): Entity {
    const entity = super.create()

    entity.addComponent('Name', new NameComponent('airTank'))
    entity.addComponent('Ai', new AiComponent(entity, airTankAI(entity, this.world)))

    return entity
  }
}
