import { buildCollider, ColliderComponent } from '@game/components/colliderComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { SensorComponent } from '@game/components/sensorComponent'
import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { Category, CategorySet } from './category'
import { EntityFactory } from './entityFactory'

export class EventSensorFactory extends EntityFactory {
  private position = new Vec2(0, 0)
  private size = new Vec2(0, 0)
  private event = ''

  public create(): Entity {
    const entity = new Entity()

    entity.addComponent(
      'Position',
      new PositionComponent(this.position.x + this.size.x / 2, this.position.y - this.size.y / 2)
    )
    entity.addComponent(
      'Collider',
      new ColliderComponent(
        buildCollider({
          entity,
          geometry: {
            type: 'AABB',
            offset: new Vec2(-this.size.x / 2, -this.size.y / 2),
            size: new Vec2(this.size.x, this.size.y),
          },
          category: Category.SENSOR,
          mask: new CategorySet(Category.SENSOR),
          isSensor: true,
        })
      )
    )
    entity.addComponent('Sensor', new SensorComponent(this.event))

    return entity
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
