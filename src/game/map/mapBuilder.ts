import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { LaserSightFactory } from '@game/entities/laserSightFactory'
import { PlayerFactory } from '@game/entities/object/playerFactory'
import { PlayerUIFactory } from '@game/entities/playerUIFactory'
import { assert } from '@utils/assertion'
import { buildBackgroundLayer } from './backgroundLayerBuilder'
import { ObjectLayerFactory } from './objectLayerFactory'
import { TileLayerFactory } from './tileLayerFactory'

type CustomPropertyValue = boolean | number | string
type CustomProperty = {
  name: string
  type: string
  value: CustomPropertyValue
}

export type MapObject = {
  gid: number
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

export type TileSetData = {
  columns: number
  image: string
  imageheight: number
  imagewidth: number
  margin: number
  name: string
  spacing: number
  tilecount: number
  tiledversion: string
  tileheight: number
  tilewidth: number
  type: string
  version: number
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

export type ObjectLayer = {
  draworder: string
  id: number
  name: string
  objects: Array<MapObject>
  opacity: number
  type: string
  visible: boolean
  x: number
  y: number
  properties?: Array<CustomProperty>
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

export const getCustomProperty = <T extends CustomPropertyValue>(
  object: { properties?: Array<CustomProperty> },
  propertyName: string
): T | undefined =>
  object.properties?.find(property => property.name === propertyName)?.value as T | undefined
export const getTileSetDataFromGid = (gid: number, tileSets: Array<TileSet>): TileSetData => {
  const { source } = tileSets.find(tileSet => tileSet.firstgid === gid) as TileSet
  return require(`../../../res/map/${source}`) // eslint-disable-line  @typescript-eslint/no-var-requires
}

export class MapBuilder {
  private playerSpanwners = new Map<number, Vec2>()

  public constructor(private world: World) {}

  public build(map: Map): void {
    const objectLayerFactory = new ObjectLayerFactory(this.world)
    const tileLayerFactory = new TileLayerFactory(this, this.world, map.tilesets)
    const tileSize = new Vec2(map.tilewidth, map.tileheight)
    for (const layer of map.layers) {
      switch (layer.name) {
        case 'map':
        case 'moss':
          tileLayerFactory.build(layer as TileLayer, tileSize)
          break
        case 'air':
        case 'sensor':
        case 'equipment':
        case 'airGeyser':
        case 'player':
          objectLayerFactory.build(this, layer as ObjectLayer)
          break
        case 'background':
          buildBackgroundLayer(this.world, layer as ObjectLayer, map.tilesets)
          break
      }
    }
  }

  public registerSpawner(id: number, pos: Vec2): void {
    assert(this.playerSpanwners.has(id) === false, `Multiple player spawner ID detected: ${id}`)
    this.playerSpanwners.set(id, pos)
  }

  public spawnPlayer(id: number): void {
    const pos = this.playerSpanwners.get(id)
    assert(pos, `player spawner ID '${id}' is not found`)

    this.world.addEntity(new PlayerFactory(pos, this.world).create())
    this.world.addEntity(new LaserSightFactory(this.world).create())
    this.world.addEntity(new PlayerUIFactory(this.world).create())
  }
}

export function getTileId(layer: TileLayer, x: number, y: number): number {
  if (x < 0) return 0
  if (y < 0) return 0
  if (x >= layer.width) return 0
  if (y >= layer.height) return 0
  return layer.data[x + y * layer.width]
}
