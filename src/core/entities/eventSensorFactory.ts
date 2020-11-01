import { AABBDef, ColliderComponent } from '../components/colliderComponent'
import { PositionComponent } from '../components/positionComponent'
import { SensorComponent } from '../components/sensorComponent'
import { Entity } from '../ecs/entity'
import { Vec2 } from '../math/vec2'
import { CategoryList } from './category'
import { EntityFactory } from './entityFactory'

export class EventSensorFactory extends EntityFactory {
  private x = 0
  private y = 0
  private w = 0
  private h = 0
  private event = ''

  public create(): Entity {
    const result = new Entity()

    result.addComponent('Position', new PositionComponent(this.x + this.w / 2, this.y - this.h / 2))

    const collider = new ColliderComponent(result)
    const aabb = new AABBDef(new Vec2(this.w, this.h), CategoryList.eventSensor)
    aabb.offset = new Vec2(-this.w / 2, -this.h / 2)
    collider.createCollider(aabb)
    result.addComponent('Collider', collider)

    result.addComponent('Sensor', new SensorComponent(this.event))

    return result
  }

  public setPosition(x: number, y: number): EventSensorFactory {
    this.x = x
    this.y = y
    return this
  }

  public setSize(w: number, h: number): EventSensorFactory {
    this.w = w
    this.h = h
    return this
  }

  public setEvent(event: string): EventSensorFactory {
    this.event = event
    return this
  }
}
