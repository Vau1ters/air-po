import { Entity } from '@core/ecs/entity'
import { NameComponent } from '@game/components/nameComponent'
import { ObjectEntityFactory } from '@game/entities/objectEntityFactory'

export default class VillagerFactory extends ObjectEntityFactory {
  public create(): Entity {
    const entity = super.create()
    const name = this.findProperty('string', 'name')
    if (name !== undefined) {
      entity.addComponent('Name', new NameComponent(name))
    }
    return entity
  }
}
