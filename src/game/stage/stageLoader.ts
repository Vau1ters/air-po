import * as t from 'io-ts'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { ObjectLayer, ObjectLayerLoader, ObjectLayerType } from './objectLayerLoader'
import { TileLayer, TileLayerLoader, TileLayerType } from './tileLayerLoader'
import { stageList } from './stageList'
import { loadAirLayer } from './airLayerLoader'
import { loadBackgroundLayer } from './backgroundLayerLoader'
import { TileSetType } from './tileSet'
import { decodeJson } from '@utils/json'
import { Stage } from './stage'

export type StageName = keyof typeof stageList

const StageType = t.type({
  compressionlevel: t.number,
  height: t.number,
  infinite: t.boolean,
  layers: t.array(t.union([TileLayerType, ObjectLayerType])),
  nextlayerid: t.number,
  nextobjectid: t.number,
  orientation: t.literal('orthogonal'),
  renderorder: t.literal('right-up'),
  tiledversion: t.string,
  tileheight: t.number,
  tilesets: t.array(TileSetType),
  tilewidth: t.number,
  type: t.literal('map'),
  version: t.string,
  width: t.number,
})

type StageSetting = t.TypeOf<typeof StageType>

export const loadStage = (stageName: StageName, world: World): Stage => {
  const result = new Stage(stageName, world)
  const stage = decodeJson<StageSetting>(stageList[stageName], StageType)
  const tileLayerLoader = new TileLayerLoader(result, world, stage.tilesets)
  const objectLayerLoader = new ObjectLayerLoader(result, world, stage.tilesets)
  const tileSize = new Vec2(stage.tilewidth, stage.tileheight)
  for (const layer of stage.layers) {
    switch (layer.type) {
      case 'tilelayer':
        tileLayerLoader.load(layer as TileLayer, tileSize)
        break
      case 'objectgroup':
        switch (layer.name) {
          case 'air':
            loadAirLayer(layer as ObjectLayer, world, result)
            break
          case 'background':
            loadBackgroundLayer(layer as ObjectLayer, world, stage.tilesets)
            break
          default:
            objectLayerLoader.load(layer as ObjectLayer)
            break
        }
        break
    }
  }
  return result
}
