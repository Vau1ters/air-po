import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { ColliderComponent, buildCollider } from '@game/components/colliderComponent'
import { EquipmentTypes } from '@game/components/equipmentComponent'
import { SensorComponent } from '@game/components/sensorComponent'
import { CategorySet } from '../category'
import { ObjectEntityFactory } from './objectEntityFactory'
import { assert } from '@utils/assertion'
import { AnimationSprite } from '@core/graphics/animationSprite'

export class EquipmentTileFactory extends ObjectEntityFactory {
  public create(): Entity {
    const equipmentType = this.object.properties?.find(prop => prop.name === 'type')
      ?.value as EquipmentTypes
    assert(equipmentType, `Equipment must have string property 'type'`)

    const entity = super.create()

    const [sprite] = entity.getComponent('Draw').children as [AnimationSprite]
    sprite.state = equipmentType

    entity.addComponent(
      'Collider',
      new ColliderComponent(
        buildCollider({
          entity,
          geometry: {
            type: 'AABB',
            size: new Vec2(this.object.width, this.object.height),
          },
          category: 'equipment',
          mask: new CategorySet('sensor'),
        })
      )
    )
    entity.addComponent('Sensor', new SensorComponent(`equipItem ${equipmentType} ${entity.id}`))

    return entity
  }
}
