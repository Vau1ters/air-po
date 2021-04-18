import { World } from '@core/ecs/world'
import { WallFactory } from '@game/entities/wallFactory'
import { Random } from '@utils/random'
import { AirFactory } from '@game/entities/airFactory'
import { NPCFactory, NPCType } from '@game/entities/npcFactory'
import { PlayerFactory } from '@game/entities/playerFactory'
import { assert } from '@utils/assertion'
import { EventSensorFactory } from '@game/entities/eventSensorFactory'
import { MossFactory } from '@game/entities/mossFactory'
import { EquipmentTileFactory } from '@game/entities/equipmentTileFactory'
import { EquipmentTypes } from '@game/components/equipmentComponent'
import { AirGeyserFactory } from '@game/entities/airGeyserFactory'
import { ThroughFloorFactory } from '@game/entities/throughFloorFactory'
import { LaserSightFactory } from '@game/entities/laserSightFactory'
import { PlayerUIFactory } from '@game/entities/playerUIFactory'

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

type TileLayer = {
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

type TileSet = {
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
  private world: World
  private rand: Random

  public constructor(world: World) {
    this.world = world
    this.rand = new Random()
  }

  public build(map: Map, playerSpawnerID: number): void {
    for (const layer of map.layers) {
      switch (layer.name) {
        case 'air':
          this.buildAir(layer as ObjectLayer)
          break
        case 'map':
          this.buildMap(layer as TileLayer, map.tilesets, [map.tilewidth, map.tileheight])
          break
        case 'moss':
          this.buildMap(layer as TileLayer, map.tilesets, [map.tilewidth, map.tileheight])
          break
        case 'sensor':
          this.buildSensor(layer as ObjectLayer)
          break
        case 'player':
          this.buildPlayer(layer as ObjectLayer, [map.tilewidth, map.tileheight], playerSpawnerID)
          break
        case 'equipment':
          this.buildEquipment(layer as ObjectLayer)
          break
        case 'airGeyser':
          this.buildAirGeyser(layer as ObjectLayer, [map.tilewidth, map.tileheight])
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

  private buildAirGeyser(airGeyserLayer: ObjectLayer, tileSize: [number, number]): void {
    const [_, th] = tileSize

    for (const airGeyserData of airGeyserLayer.objects) {
      const airGeyserFactory = new AirGeyserFactory(this.world)
      const maxQuantity = airGeyserData.properties?.find(
        property => property.name === 'maxQuantity'
      )?.value
      const increaseRate = airGeyserData.properties?.find(
        property => property.name === 'increaseRate'
      )?.value

      airGeyserFactory.setPosition(
        airGeyserData.x + airGeyserData.width / 2,
        airGeyserData.y - th - airGeyserData.height / 2
      )
      if (maxQuantity) airGeyserFactory.setMaxQuantity(Number(maxQuantity))
      if (increaseRate) airGeyserFactory.setIncreaseRate(Number(increaseRate))

      this.world.addEntity(airGeyserFactory.create())
    }
  }

  private buildMap(mapLayer: TileLayer, tileSets: Array<TileSet>, tileSize: number[]): void {
    const getTileId = (x: number, y: number): number => {
      if (x < 0) return 0
      if (y < 0) return 0
      if (x >= mapLayer.width) return 0
      if (y >= mapLayer.height) return 0
      return mapLayer.data[x + y * mapLayer.width]
    }

    type Builder = { firstgid: number; builder: (pos: number[]) => void }
    const builders = new Array<Builder>()
    for (const { firstgid, source } of tileSets) {
      const content = require(`../../../res/map/${source}`) // eslint-disable-line  @typescript-eslint/no-var-requires
      const size = [content.tilewidth, content.tileheight]
      switch (content.name) {
        case 'wall':
          builders.push({
            firstgid,
            builder: (pos: number[]) => this.buildWall(pos, tileSize, { firstgid, getTileId }),
          })
          break
        case 'throughFloor':
          builders.push({
            firstgid,
            builder: (pos: number[]) => this.buildThroughFloor(pos, tileSize),
          })
          break
        case 'enemy1':
        case 'slime1':
        case 'balloonvine':
        case 'dandelion':
        case 'vine':
          builders.push({
            firstgid,
            builder: (pos: number[]) =>
              this.buildNPC(pos, tileSize, { type: content.name as NPCType, size }),
          })
          break
        case 'snibee':
          builders.push({
            firstgid,
            builder: (pos: number[]) =>
              this.buildNPC(pos, tileSize, { type: content.name as NPCType, size }),
          })
          break
        case 'moss':
          builders.push({
            firstgid,
            builder: (pos: number[]) => this.buildMoss(pos, tileSize),
          })
          break
      }
    }

    const findBuilder = (tileId: number): ((pos: number[]) => void) => {
      for (let i = 0; i < builders.length; i++) {
        if (tileId < builders[i].firstgid) continue
        if (i < builders.length - 1 && builders[i + 1].firstgid <= tileId) continue
        return builders[i].builder
      }
      assert(false, `Could not find appropriate builder for tileId ${tileId}`)
    }

    for (let x = 0; x < mapLayer.width; x++) {
      for (let y = 0; y < mapLayer.height; y++) {
        const tileId = getTileId(x, y)
        if (tileId === 0) continue
        findBuilder(tileId)([x, y])
      }
    }
  }

  private buildWall(
    pos: number[],
    tileSize: number[],
    wallInfo: { firstgid: number; getTileId: (x: number, y: number) => number }
  ): void {
    const factory = new WallFactory()
    const cells = []
    const [x, y] = pos
    const [tw, th] = tileSize
    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 3; i++) {
        const xi = x + i - 1
        const yj = y + j - 1
        cells.push(wallInfo.getTileId(xi, yj))
      }
    }
    factory.tileId = this.calcWallId(cells) - wallInfo.firstgid
    factory.shouldCollide = cells.some(c => c === 0)
    const wall = factory.create()
    const p = wall.getComponent('Position')
    p.x = tw * x + tw / 2
    p.y = th * y - th / 2
    this.world.addEntity(wall)
  }

  private buildThroughFloor(pos: number[], tileSize: number[]): void {
    const [x, y] = pos
    const [tw, th] = tileSize
    const throughFloor = new ThroughFloorFactory().create()
    const throughFloorPosition = throughFloor.getComponent('Position')
    throughFloorPosition.x = x * tw + tw / 2
    throughFloorPosition.y = y * th - th / 2
    this.world.addEntity(throughFloor)
  }

  private buildNPC(
    pos: number[],
    tileSize: number[],
    npcInfo: { type: NPCType; size: number[] }
  ): void {
    const [x, y] = pos
    const [w, h] = npcInfo.size
    const [tw, th] = tileSize
    const npc = new NPCFactory(this.world, npcInfo.type).create()
    const npcPosition = npc.getComponent('Position')
    npcPosition.x = x * tw + w / 2
    npcPosition.y = y * th - h / 2
    this.world.addEntity(npc)
  }

  private buildPlayer(playerLayer: ObjectLayer, tileSize: number[], playerSpawnerID: number): void {
    const playerInfo = playerLayer.objects.find(
      (player: MapObject) =>
        player.properties?.find(prop => prop.name === 'id')?.value === playerSpawnerID
    )
    assert(
      playerInfo,
      `There are no object with custom property 'id = ${playerSpawnerID}' in player layer`
    )
    const { x, y, width, height } = playerInfo
    const player = new PlayerFactory(this.world).create()
    const playerPosition = player.getComponent('Position')
    playerPosition.x = x + width / 2
    playerPosition.y = y - height
    this.world.addEntity(player)
    this.world.addEntity(new LaserSightFactory(this.world).create())
    this.world.addEntity(new PlayerUIFactory(this.world).create())
  }

  private buildMoss(pos: number[], tileSize: number[]): void {
    const [x, y] = pos
    const [tw, th] = tileSize
    const moss = new MossFactory(this.world).create()
    const mossPosition = moss.getComponent('Position')
    mossPosition.x = x * tw + tw / 2
    mossPosition.y = y * th - th / 2
    this.world.addEntity(moss)
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

  private calcWallId(cell: number[]): number {
    if (
      cell[0] != 0 &&
      cell[1] != 0 &&
      cell[2] != 0 &&
      cell[3] != 0 &&
      cell[5] != 0 &&
      cell[6] != 0 &&
      cell[7] != 0 &&
      cell[8] != 0
    ) {
      // completely filled
      return this.randomChoice([10, 11, 14, 15, 18, 19, 22, 23])
    }
    if (
      cell[1] != 0 &&
      cell[2] != 0 &&
      cell[3] != 0 &&
      cell[5] != 0 &&
      cell[6] != 0 &&
      cell[7] != 0 &&
      cell[8] != 0
    ) {
      // lack left up
      return 32
    }
    if (
      cell[0] != 0 &&
      cell[1] != 0 &&
      cell[3] != 0 &&
      cell[5] != 0 &&
      cell[6] != 0 &&
      cell[7] != 0 &&
      cell[8] != 0
    ) {
      // lack right up
      return 29
    }
    if (
      cell[0] != 0 &&
      cell[1] != 0 &&
      cell[2] != 0 &&
      cell[3] != 0 &&
      cell[5] != 0 &&
      cell[7] != 0 &&
      cell[8] != 0
    ) {
      // lack left down
      return 8
    }
    if (
      cell[0] != 0 &&
      cell[1] != 0 &&
      cell[2] != 0 &&
      cell[3] != 0 &&
      cell[5] != 0 &&
      cell[6] != 0 &&
      cell[7] != 0
    ) {
      // lack right down
      return 5
    }
    if (cell[1] == 0 && cell[3] == 0 && cell[5] != 0 && cell[7] != 0) {
      // left up corner
      return 1
    }
    if (cell[1] == 0 && cell[3] != 0 && cell[5] == 0 && cell[7] != 0) {
      // right up corner
      return 4
    }
    if (cell[1] != 0 && cell[3] == 0 && cell[5] != 0 && cell[7] == 0) {
      // left down corner
      return 25
    }
    if (cell[1] != 0 && cell[3] != 0 && cell[5] == 0 && cell[7] == 0) {
      // right down corner
      return 28
    }
    if (cell[1] == 0) {
      // up
      return this.randomChoice([2, 3, 30, 31])
    }
    if (cell[3] == 0) {
      // left
      return this.randomChoice([9, 17, 16, 24])
    }
    if (cell[5] == 0) {
      // right
      return this.randomChoice([12, 20, 13, 21])
    }
    if (cell[7] == 0) {
      // down
      return this.randomChoice([26, 27, 6, 7])
    }
    return 1
  }

  private randomChoice(candidates: number[]): number {
    return candidates[Math.abs(this.rand.next()) % candidates.length]
  }
}
