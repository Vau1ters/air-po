import { Map, MapBuilder } from '@game/map/mapBuilder'
import { Collider } from '@game/components/colliderComponent'
import { Entity } from '@core/ecs/entity'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { System } from '@core/ecs/system'
import { World } from '@core/ecs/world'
import { EquipmentTypes } from '@game/components/equipmentComponent'
import * as Sound from '@core/sound/sound'

export class EventSensorSystem extends System {
  private sensorFamily: Family
  private playerFamily: Family

  constructor(world: World) {
    super(world)
    this.sensorFamily = new FamilyBuilder(world).include('Sensor').build()
    this.sensorFamily.entityAddedEvent.addObserver((e: Entity) => this.onSensorAdded(e))
    this.playerFamily = new FamilyBuilder(world).include('Player').build()
  }

  public update(): void {}

  private onSensorAdded(entity: Entity): void {
    const event = entity.getComponent('Sensor').event
    for (const c of entity.getComponent('Collider').colliders) {
      c.callbacks.add(async (_, other: Collider) => {
        if (!other.tag.has('playerSensor')) return
        await this.fireEvent(event)
      })
    }
  }

  private async fireEvent(event: string): Promise<void> {
    const [eventName, ...options] = event.split(' ')
    switch (eventName) {
      case 'changeMap':
        await this.moveEvent(options[0], Number(options[1]))
        break
      case 'equipItem':
        await this.equipItemEvent(options[0] as EquipmentTypes, Number(options[1]))
        break
    }
  }

  private async moveEvent(newMapName: string, spawnerID: number): Promise<void> {
    const map = (await import(`../../../res/map/${newMapName}.json`)) as Map
    this.world.reset()
    const mapBuilder = new MapBuilder(this.world)
    mapBuilder.build(map, spawnerID)
  }

  private async equipItemEvent(equipmentType: EquipmentTypes, equipmentId: number): Promise<void> {
    Sound.play('getAirTank')
    const player = this.playerFamily.entityArray[0]
    const equipmentComponent = player.getComponent('Equipment')
    equipmentComponent.equipEvent.notify(equipmentType)
    this.world.removeEntityById(equipmentId)
  }
}
