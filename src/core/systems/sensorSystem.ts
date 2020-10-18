import { MapChangeComponent } from '../components/mapChangeComponent'
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
    const event = entity.getComponent('Sensor').event
    for (const c of entity.getComponent('Collider').colliders) {
      c.callbacks.add(() => this.fireEvent(event))
    }
  }

  private fireEvent(event: string): void {
    const [eventName, ...options] = event.split(' ')
    switch (eventName) {
      case 'move':
        this.moveEvent(options[0], Number(options[1]))
        break
    }
  }

  private moveEvent(newMapName: string, spawnerID: number): void {
    const entity = new Entity()
    entity.addComponent('MapChange', new MapChangeComponent(newMapName, spawnerID))
    this.world.addEntity(entity)
  }
}
