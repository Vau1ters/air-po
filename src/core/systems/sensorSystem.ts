import { Entity } from '../ecs/entity'
import { Family, FamilyBuilder } from '../ecs/family'
import { System } from '../ecs/system'
import { World } from '../ecs/world'

export class SensorSystem extends System {
  private sensorFamily: Family

  constructor(world: World) {
    super(world)
    this.sensorFamily = new FamilyBuilder(world).include('Sensor').build()
    this.sensorFamily.entityAddedEvent.addObserver((e: Entity) => this.onSensorAdded(e))
  }

  public update(): void {}

  private onSensorAdded(entity: Entity): void {
    const eventName = entity.getComponent('Sensor').eventName
    for (const c of entity.getComponent('Collider').colliders) {
      c.callbacks.add(() => this.fireEvent(eventName))
    }
  }

  private fireEvent(eventName: string): void {
    console.log(eventName)
  }
}
