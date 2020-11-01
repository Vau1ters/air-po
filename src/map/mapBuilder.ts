import { World } from '../core/ecs/world'
import { WallFactory } from '../core/entities/wallFactory'
import { Random } from '../utils/random'
import { AirFactory } from '../core/entities/airFactory'
import { NPCFactory, NPCType } from '../core/entities/npcFactory'
import { PlayerFactory } from '../core/entities/playerFactory'
import { assert } from '../utils/assertion'
import { EventSensorFactory } from '../core/entities/eventSensorFactory'
import { MossFactory } from '../core/entities/mossFactory'

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
      }
    }
  }

  private buildAir(airLayer: ObjectLayer): void {
    assert(airLayer.objects.length > 0)
    for (const airData of airLayer.objects) {
      assert(airData.ellipse === true)
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
      const content = require(`../../res/${source}`) // eslint-disable-line  @typescript-eslint/no-var-requires
      const size = [content.tilewidth, content.tileheight]
      switch (content.name) {
        case 'wall':
          builders.push({
            firstgid,
            builder: (pos: number[]) => this.buildWall(pos, tileSize, { firstgid, getTileId }),
          })
          break
        case 'enemy1':
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
      console.error(`Could not find appropriate builder for tileId ${tileId}`)
      assert(false)
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
    assert(playerInfo)
    const { x, y, width, height } = playerInfo
    const player = new PlayerFactory(this.world).create()
    const playerPosition = player.getComponent('Position')
    playerPosition.x = x + width / 2
    playerPosition.y = y - height
    this.world.addEntity(player)
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
      assert(properties)

      const eventProperty = properties.find(prop => prop.name === 'event')
      assert(eventProperty)
      assert(eventProperty.type === 'string')

      const event = eventProperty.value as string

      const sensor = new EventSensorFactory()
        .setPosition(x, y)
        .setSize(width, height)
        .setEvent(event)
        .create()
      this.world.addEntity(sensor)
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
