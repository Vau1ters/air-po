import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { LaserSightFactory } from '@game/entities/laserSightFactory'
import { AirFactory } from '@game/entities/object/airFactory'
import { AirGeyserFactory } from '@game/entities/object/airGeyserFactory'
import { EquipmentTileFactory } from '@game/entities/object/equipmentTileFactory'
import { EventSensorFactory } from '@game/entities/object/eventSensorFactory'
import { ObjectEntityFactory } from '@game/entities/object/objectEntityFactory'
import { PlayerFactory } from '@game/entities/object/playerFactory'
import { PlayerUIFactory } from '@game/entities/playerUIFactory'
import { assert } from '@utils/assertion'
import { ObjectLayer, MapObject } from './mapBuilder'

type Builder = new (name: string, object: MapObject, world: World) => ObjectEntityFactory

export class ObjectLayerFactory {
  private builders: { [keys: string]: Builder }
  public playerSpanwners = new Map<number, () => void>()

  constructor(private world: World) {
    this.builders = {
      air: AirFactory,
      airGeyser: AirGeyserFactory,
      sensor: EventSensorFactory,
      equipment: EquipmentTileFactory,
    }
  }

  public build(layer: ObjectLayer): void {
    for (const object of layer.objects) {
      let spawnerID: number | undefined
      switch (layer.name) {
        case 'player':
          spawnerID = object.properties?.find(prop => prop.name === 'id')?.value as
            | number
            | undefined
          assert(spawnerID !== undefined, 'player spawner ID is not set')
          assert(
            this.playerSpanwners.has(spawnerID) === false,
            `Multiple player spawner ID detected: ${spawnerID}`
          )
          this.playerSpanwners.set(spawnerID, () => this.buildPlayer(object))
          break
        default:
          this.world.addEntity(
            new this.builders[layer.name](layer.name, object, this.world).create()
          )
      }
    }
  }

  public buildPlayer(object: MapObject | Vec2): void {
    const player = new PlayerFactory(object, this.world).create()
    this.world.addEntity(player)
    this.world.addEntity(new LaserSightFactory(this.world).create())
    this.world.addEntity(new PlayerUIFactory(this.world).create())
  }
}
