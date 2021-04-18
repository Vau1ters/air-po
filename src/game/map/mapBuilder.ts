import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { EquipmentTypes } from '@game/components/equipmentComponent'
import { AirFactory } from '@game/entities/airFactory'
import { EquipmentTileFactory } from '@game/entities/equipmentTileFactory'
import { EventSensorFactory } from '@game/entities/eventSensorFactory'
import { LaserSightFactory } from '@game/entities/laserSightFactory'
import { AirGeyserFactory } from '@game/entities/mapObject/airGeyserFactory'
import { PlayerFactory } from '@game/entities/mapObject/playerFactory'
import { PlayerUIFactory } from '@game/entities/playerUIFactory'
import { assert } from '@utils/assertion'
import { TileLayerFactory } from './tileLayerFactory'

type CustomProperty = {
  name: string
  type: string
  value: boolean | number | string
}

type MapObject = {
  height: number
  id: number
  name: string
  rotation: number
  type: string
  visible: boolean
  width: number
  x: number
  y: number
  ellipse?: boolean
  properties?: Array<CustomProperty>
}

export type TileLayer = {
  data: Array<number>
  height: number
  id: number
  name: string
  opacity: number
  type: string
  visible: boolean
  width: number
  x: number
  y: number
}

type ObjectLayer = {
  draworder: string
  id: number
  name: string
  objects: Array<MapObject>
  opacity: number
  type: string
  visible: boolean
  x: number
  y: number
}

export type TileSet = {
  firstgid: number
  source: string
}

export type Map = {
  compressionlevel: number
  height: number
  infinite: boolean
  layers: Array<TileLayer | ObjectLayer>
  nextlayerid: number
  nextobjectid: number
  orientation: string
  renderorder: string
  tiledversion: string
  tileheight: number
  tilesets: Array<TileSet>
  tilewidth: number
  type: string
  version: number
  width: number
}

export class MapBuilder {
  public constructor(private world: World) {}

  public build(map: Map, playerSpawnerID: number): void {
    const tileLayerFactory = new TileLayerFactory(this.world, map.tilesets)
    const tileSize = new Vec2(map.tilewidth, map.tileheight)
    for (const layer of map.layers) {
      switch (layer.name) {
        case 'map':
        case 'moss':
          tileLayerFactory.build(layer as TileLayer, tileSize)
          break
        case 'air':
          this.buildAir(layer as ObjectLayer)
          break
        case 'sensor':
          this.buildSensor(layer as ObjectLayer)
          break
        case 'player':
          this.buildPlayer(layer as ObjectLayer, playerSpawnerID)
          break
        case 'equipment':
          this.buildEquipment(layer as ObjectLayer)
          break
        case 'airGeyser':
          this.buildAirGeyser(layer as ObjectLayer)
          break
      }
    }
  }

  private buildAir(airLayer: ObjectLayer): void {
    for (const airData of airLayer.objects) {
      assert(airData.ellipse === true, 'Air must be ellipse')
      const radius = airData.width / 2
      const x = airData.x + radius
      const y = airData.y + radius
      const air = new AirFactory()
        .setPosition(x, y)
        .setQuantity(radius)
        .create()
      this.world.addEntity(air)
    }
  }

  private buildAirGeyser(airGeyserLayer: ObjectLayer): void {
    for (const airGeyserData of airGeyserLayer.objects) {
      const airGeyserFactory = new AirGeyserFactory(
        new Vec2(airGeyserData.x, airGeyserData.y),
        'airGeyser',
        0,
        this.world
      )
      const maxQuantity = airGeyserData.properties?.find(
        property => property.name === 'maxQuantity'
      )?.value
      const increaseRate = airGeyserData.properties?.find(
        property => property.name === 'increaseRate'
      )?.value

      if (maxQuantity) airGeyserFactory.maxQuantity = Number(maxQuantity)
      if (increaseRate) airGeyserFactory.increaseRate = Number(increaseRate)

      this.world.addEntity(airGeyserFactory.create())
    }
  }

  private buildSensor(sensorLayer: ObjectLayer): void {
    for (const { x, y, width, height, properties } of sensorLayer.objects) {
      assert(properties, `Sensor must have custom property`)

      const eventProperty = properties.find(prop => prop.name === 'event')
      assert(
        eventProperty && eventProperty.type === 'string',
        `Sensor must have string property 'event'`
      )

      const event = eventProperty.value as string

      const sensor = new EventSensorFactory()
        .setPosition(x, y)
        .setSize(width, height)
        .setEvent(event)
        .create()
      this.world.addEntity(sensor)
    }
  }

  private buildEquipment(equipmentLayer: ObjectLayer): void {
    for (const { x, y, width, height, properties } of equipmentLayer.objects) {
      assert(properties, 'Equipment must have custom property')

      const typeProperty = properties.find(prop => prop.name === 'type')
      assert(
        typeProperty && typeProperty.type === 'string',
        `Equipment must have string property 'type'`
      )

      const equipmentType = typeProperty.value as EquipmentTypes

      const equipment = new EquipmentTileFactory()
        .setPosition(x, y)
        .setSize(width, height)
        .setEquipmentType(equipmentType)
        .create()
      this.world.addEntity(equipment)
    }
  }

  private buildPlayer(playerLayer: ObjectLayer, playerSpawnerID: number): void {
    const playerInfo = playerLayer.objects.find(
      (player: MapObject) =>
        player.properties?.find(prop => prop.name === 'id')?.value === playerSpawnerID
    )
    assert(
      playerInfo,
      `There are no object with custom property 'id = ${playerSpawnerID}' in player layer`
    )
    const { x, y, width, height } = playerInfo
    const player = new PlayerFactory(
      new Vec2(x + width / 2, y - height),
      'player',
      0,
      this.world
    ).create()
    this.world.addEntity(player)
    this.world.addEntity(new LaserSightFactory(player, this.world).create())
    this.world.addEntity(new PlayerUIFactory(this.world).create())
  }
}
