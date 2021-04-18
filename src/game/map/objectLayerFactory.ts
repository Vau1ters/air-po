import { World } from '@core/ecs/world'
import { LaserSightFactory } from '@game/entities/laserSightFactory'
import { AirFactory } from '@game/entities/object/airFactory'
import { AirGeyserFactory } from '@game/entities/object/airGeyserFactory'
import { EquipmentTileFactory } from '@game/entities/object/equipmentTileFactory'
import { EventSensorFactory } from '@game/entities/object/eventSensorFactory'
import { ObjectEntityFactory } from '@game/entities/object/objectEntityFactory'
import { PlayerFactory } from '@game/entities/object/playerFactory'
import { PlayerUIFactory } from '@game/entities/playerUIFactory'
import { ObjectLayer, MapObject } from './mapBuilder'

type Builder = new (name: string, object: MapObject, world: World) => ObjectEntityFactory

export class ObjectLayerFactory {
  private builders: { [keys: string]: Builder }
  constructor(private world: World, private playerSpawnerID: number) {
    this.builders = {
      air: AirFactory,
      airGeyser: AirGeyserFactory,
      sensor: EventSensorFactory,
      equipment: EquipmentTileFactory,
    }
  }

  public build(layer: ObjectLayer): void {
    for (const object of layer.objects) {
      switch (layer.name) {
        case 'player':
          this.buildPlayer(layer.name, object)
          break
        default:
          this.world.addEntity(
            new this.builders[layer.name](layer.name, object, this.world).create()
          )
      }
    }
  }

  private buildPlayer(name: string, object: MapObject): void {
    if (!(object.properties?.find(prop => prop.name === 'id')?.value === this.playerSpawnerID))
      return
    const player = new PlayerFactory(name, object, this.world).create()
    this.world.addEntity(player)
    this.world.addEntity(new LaserSightFactory(this.world).create())
    this.world.addEntity(new PlayerUIFactory(this.world).create())
  }
}
