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

export class EquipmentTileFactory extends ObjectEntityFactory {
  private equipmentType: EquipmentTypes = 'AirTank'

  public create(): Entity {
    const entity = super.create()

    entity.addComponent(
      'Draw',
      new DrawComponent({
        entity,
        child: {
          sprite: parseAnimation(equipmentDefinition.sprite),
          state: this.equipmentType,
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
    entity.addComponent(
      'Sensor',
      new SensorComponent(`equipItem ${this.equipmentType} ${entity.id}`)
    )

    return entity
  }

  public setEquipmentType(type: EquipmentTypes): this {
    this.equipmentType = type
    return this
  }
}
