import { ColliderBuilder, ColliderComponent } from '@game/components/colliderComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { SensorComponent } from '@game/components/sensorComponent'
import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { CategoryList } from './category'
import { EntityFactory } from './entityFactory'

export class EventSensorFactory extends EntityFactory {
  private position = new Vec2(0, 0)
  private size = new Vec2(0, 0)
  private event = ''

  public create(): Entity {
    const result = new Entity()

    result.addComponent(
      'Position',
      new PositionComponent(this.position.x + this.size.x / 2, this.position.y - this.size.y / 2)
    )

    const collider = new ColliderComponent()
    collider.colliders.push(
      new ColliderBuilder()
        .setEntity(result)
        .setAABB({
          offset: new Vec2(-this.size.x / 2, -this.size.y / 2),
          size: new Vec2(this.size.x, this.size.y),
        })
        .setCategory(CategoryList.eventSensor)
        .setIsSensor(true)
        .build()
    )
    result.addComponent('Collider', collider)

    result.addComponent('Sensor', new SensorComponent(this.event))

    return result
  }

  public setPosition(x: number, y: number): EventSensorFactory {
    this.position = new Vec2(x, y)
    return this
  }

  public setSize(w: number, h: number): EventSensorFactory {
    this.size = new Vec2(w, h)
    return this
  }

  public setEvent(event: string): EventSensorFactory {
    this.event = event
    return this
  }
}
