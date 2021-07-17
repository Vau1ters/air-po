import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { ColliderComponent, buildCollider } from '@game/components/colliderComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { EquipmentTypes } from '@game/components/equipmentComponent'
import { SensorComponent } from '@game/components/sensorComponent'
import { Category, CategorySet } from '../category'
import { ObjectEntityFactory } from './objectEntityFactory'
import { assert } from '@utils/assertion'
import { createSprite } from '@core/graphics/art'

export class EquipmentTileFactory extends ObjectEntityFactory {
  public create(): Entity {
    const equipmentType = this.object.properties?.find(prop => prop.name === 'type')
      ?.value as EquipmentTypes
    assert(equipmentType, `Equipment must have string property 'type'`)

    const entity = super.create()

    entity.addComponent(
      'Draw',
      new DrawComponent({
        entity,
        child: {
          sprite: createSprite('equipment'),
          state: equipmentType,
        },
      })
    )
    entity.addComponent(
      'Collider',
      new ColliderComponent(
        buildCollider({
          entity,
          geometry: {
            type: 'AABB',
            size: new Vec2(this.object.width, this.object.height),
          },
          category: Category.EQUIPMENT,
          mask: new CategorySet(Category.SENSOR),
        })
      )
    )
    entity.addComponent('Sensor', new SensorComponent(`equipItem ${equipmentType} ${entity.id}`))

    return entity
  }
}
