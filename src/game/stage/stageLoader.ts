import * as t from 'io-ts'
import { PathReporter } from 'io-ts/PathReporter'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { assert } from '@utils/assertion'
import { loadObjectLayer, ObjectLayer, ObjectLayerType } from './objectLayerLoader'
import { TileLayer, TileLayerLoader, TileLayerType, TileSetType } from './tileLayerLoader'
import { stageList } from './stageList'
import { Stage } from './stage'
import { loadBackgroundLayer } from './backgroundLayerLoader'

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

export const loadStage = (stageName: StageName, world: World): Stage => {
  const result = new Stage(world)
  const stage = stageList[stageName]
  const decodeResult = StageType.decode(stage)
  assert(decodeResult._tag === 'Right', PathReporter.report(decodeResult).join('\n'))
  const tileLayerLoader = new TileLayerLoader(result, world, stage.tilesets)
  const tileSize = new Vec2(stage.tilewidth, stage.tileheight)
  for (const layer of stage.layers) {
    switch (layer.type) {
      case 'tilelayer':
        tileLayerLoader.load(layer as TileLayer, tileSize)
        break
      case 'objectgroup':
        if (layer.name === 'background') {
          loadBackgroundLayer(layer as ObjectLayer, world, stage.tilesets)
        } else {
          loadObjectLayer(layer as ObjectLayer, world, result)
        }
        break
    }
  }
  return result
}
