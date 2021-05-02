import { World } from '@core/ecs/world'
import { AirFactory } from '@game/entities/object/airFactory'
import { AirGeyserFactory } from '@game/entities/object/airGeyserFactory'
import { EquipmentTileFactory } from '@game/entities/object/equipmentTileFactory'
import { EventSensorFactory } from '@game/entities/object/eventSensorFactory'
import { ObjectEntityFactory } from '@game/entities/object/objectEntityFactory'
import { assert } from '@utils/assertion'
import { ObjectLayer, MapObject, MapBuilder } from './mapBuilder'

type Builder = new (name: string, object: MapObject, world: World) => ObjectEntityFactory

export class ObjectLayerFactory {
  private builders: { [keys: string]: Builder }

  constructor(private world: World) {
    this.builders = {
      air: AirFactory,
      airGeyser: AirGeyserFactory,
      sensor: EventSensorFactory,
      equipment: EquipmentTileFactory,
    }
  }

  public build(builder: MapBuilder, layer: ObjectLayer): void {
    for (const object of layer.objects) {
      let spawnerID: number | undefined
      switch (layer.name) {
        case 'player':
          spawnerID = object.properties?.find(prop => prop.name === 'id')?.value as
            | number
            | undefined
          assert(spawnerID !== undefined, 'player spawner ID is not set')
          builder.registerSpawner(spawnerID, ObjectEntityFactory.calcPosition(object))
          break
        default:
          this.world.addEntity(
            new this.builders[layer.name](layer.name, object, this.world).create()
          )
      }
    }
  }
}
