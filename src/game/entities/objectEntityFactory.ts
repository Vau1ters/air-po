import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { NameComponent } from '@game/components/nameComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { calcCenter, StageObject } from '@game/stage/object'
import { Stage } from '@game/stage/stage'
import { EntityFactory } from './entityFactory'
import { EntityName, loadEntity } from './loader/EntityLoader'

export class ObjectEntityFactory extends EntityFactory {
  constructor(
    private name: EntityName,
    protected object: StageObject,
    protected frame: number,
    protected world: World,
    protected stage: Stage
  ) {
    super()
  }

  create(): Entity {
    const entity = loadEntity(this.name)
    const pos = calcCenter(this.object)
    entity.addComponent('Position', new PositionComponent(pos.x, pos.y))
    if (this.object.name !== '') {
      entity.addComponent('Name', new NameComponent(this.object.name))
    }
    return entity
  }
}
