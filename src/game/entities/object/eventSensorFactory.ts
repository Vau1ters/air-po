import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { ColliderComponent, buildCollider } from '@game/components/colliderComponent'
import { SensorComponent } from '@game/components/sensorComponent'
import { MapObject } from '@game/map/mapBuilder'
import { assert } from '@utils/assertion'
import { Category, CategorySet } from '../category'
import { ObjectEntityFactory } from './objectEntityFactory'

export class EventSensorFactory extends ObjectEntityFactory {
  constructor(name: string, private object: MapObject, world: World) {
    super(name, ObjectEntityFactory.calcPosition(object), world)
  }

  public create(): Entity {
    const event = this.object.properties?.find(prop => prop.name === 'event')?.value as string
    assert(event, `Sensor must have string property 'event'`)

    const entity = super.create()

    entity.addComponent(
      'Collider',
      new ColliderComponent(
        buildCollider({
          entity,
          geometry: {
            type: 'AABB',
            size: new Vec2(this.object.width, this.object.height),
          },
          category: Category.SENSOR,
          mask: new CategorySet(Category.SENSOR),
        })
      )
    )
    entity.addComponent('Sensor', new SensorComponent(event))

    return entity
  }
}
