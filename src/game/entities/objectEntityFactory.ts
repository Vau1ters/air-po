import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { NameComponent } from '@game/components/nameComponent'
import { PositionComponent } from '@game/components/positionComponent'
import {
  CustomPropertyTypeName,
  CustomPropertyValue,
  findCustomProperty,
} from '@game/stage/customProperty'
import { calcCenter, StageObject } from '@game/stage/object'
import { StageName } from '@game/stage/stageLoader'
import { assert } from '@utils/assertion'
import { EntityFactory } from './entityFactory'
import { EntityName, loadEntity } from './loader/EntityLoader'

export class ObjectEntityFactory extends EntityFactory {
  constructor(
    private name: EntityName,
    protected object: StageObject,
    protected frame: number,
    protected world: World,
    protected stageName: StageName
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

  findProperty<T extends CustomPropertyTypeName>(
    type: T,
    name: string
  ): CustomPropertyValue<T> | undefined {
    return findCustomProperty(this.object, type, name)
  }

  getProperty<T extends CustomPropertyTypeName>(type: T, name: string): CustomPropertyValue<T> {
    const prop = this.findProperty(type, name)
    assert(prop !== undefined, `Missing ${type} property '${name}'`)
    return prop
  }
}
