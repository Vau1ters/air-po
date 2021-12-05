import { Entity } from '@core/ecs/entity'
import { StagePointComponent } from '@game/components/stagePointComponent'
import { ObjectEntityFactory } from '@game/entities/objectEntityFactory'

export default class PlayerSpawnerFactory extends ObjectEntityFactory {
  public create(): Entity {
    const entity = super.create()
    const pointID = this.getProperty('int', 'id')
    entity.addComponent(
      'StagePoint',
      new StagePointComponent({ stageName: this.stageName, pointID })
    )
    return entity
  }
}
