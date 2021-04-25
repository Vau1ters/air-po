import { Entity } from '@core/ecs/entity'
import { parseAnimation } from '@core/graphics/animationParser'
import { Vec2 } from '@core/math/vec2'
import { ColliderComponent, buildCollider } from '@game/components/colliderComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { EquipmentTypes } from '@game/components/equipmentComponent'
import { SensorComponent } from '@game/components/sensorComponent'
import { Category, CategorySet } from '../category'
import { ObjectEntityFactory } from './objectEntityFactory'
import equipmentDefinition from '@res/animation/equipment.json'
import { assert } from '@utils/assertion'
import { World } from '@core/ecs/world'
import { MapObject } from '@game/map/mapBuilder'

export class EquipmentTileFactory extends ObjectEntityFactory {
  constructor(name: string, private object: MapObject, world: World) {
    super(name, ObjectEntityFactory.calcPosition(object), world)
  }

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
          sprite: parseAnimation(equipmentDefinition.sprite),
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
