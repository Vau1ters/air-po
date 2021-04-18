import { World } from '@core/ecs/world'
import { LaserSightFactory } from '@game/entities/laserSightFactory'
import { AirFactory } from '@game/entities/object/airFactory'
import { AirGeyserFactory } from '@game/entities/object/airGeyserFactory'
import { EquipmentTileFactory } from '@game/entities/object/equipmentTileFactory'
import { EventSensorFactory } from '@game/entities/object/eventSensorFactory'
import { PlayerFactory } from '@game/entities/object/playerFactory'
import { PlayerUIFactory } from '@game/entities/playerUIFactory'
import { ObjectLayer, MapObject } from './mapBuilder'

type Builder = (name: string, object: MapObject) => void

export class ObjectLayerFactory {
  private builders: { [keys: string]: Builder }
  constructor(private world: World, private playerSpawnerID: number) {
    this.builders = {
      air: (name: string, object: MapObject): void => this.buildAir(name, object),
      airGeyser: (name: string, object: MapObject): void => this.buildAirGeyser(name, object),
      sensor: (name: string, object: MapObject): void => this.buildSensor(name, object),
      equipment: (name: string, object: MapObject): void => this.buildEquipment(name, object),
      player: (name: string, object: MapObject): void => this.buildPlayer(name, object),
    }
  }

  public build(layer: ObjectLayer): void {
    for (const object of layer.objects) {
      this.builders[layer.name](layer.name, object)
    }
  }

  private buildAir(name: string, object: MapObject): void {
    const air = new AirFactory(name, object, this.world).create()
    this.world.addEntity(air)
  }

  private buildAirGeyser(name: string, object: MapObject): void {
    const airGeyserFactory = new AirGeyserFactory(name, object, this.world)
    this.world.addEntity(airGeyserFactory.create())
  }

  private buildSensor(name: string, object: MapObject): void {
    const sensor = new EventSensorFactory(name, object, this.world).create()
    this.world.addEntity(sensor)
  }

  private buildEquipment(name: string, object: MapObject): void {
    const equipment = new EquipmentTileFactory(name, object, this.world).create()
    this.world.addEntity(equipment)
  }

  private buildPlayer(name: string, object: MapObject): void {
    if (!(object.properties?.find(prop => prop.name === 'id')?.value === this.playerSpawnerID))
      return
    const player = new PlayerFactory(name, object, this.world).create()
    this.world.addEntity(player)
    this.world.addEntity(new LaserSightFactory(player, this.world).create())
    this.world.addEntity(new PlayerUIFactory(this.world).create())
  }
}
