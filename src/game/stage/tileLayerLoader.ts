import * as t from 'io-ts'
import { Vec2 } from '@core/math/vec2'
import { assert } from '@utils/assertion'
import { tileList } from './tileList'
import { CustomPropertyType } from './customProperty'
import { TileSet } from './tileSet'
import { Entity } from '@core/ecs/entity'

type TileName = keyof typeof tileList

export const TileLayerType = t.type({
  data: t.array(t.number),
  height: t.number,
  id: t.number,
  name: t.string,
  opacity: t.number,
  type: t.literal('tilelayer'),
  visible: t.boolean,
  width: t.number,
  x: t.number,
  y: t.number,
  properties: t.union([t.array(CustomPropertyType), t.undefined]),
})
export type TileLayer = t.TypeOf<typeof TileLayerType>

export const createTileLayerLoader = (
  tileSets: Array<TileSet>,
  tileSize: Vec2
): ((layer: TileLayer) => Generator<Entity>) => {
  type Builder = { firstgid: number; name: TileName; objectSize: Vec2 }
  const builders = new Array<Builder>()
  for (const { firstgid, source } of tileSets) {
    const { name, tilewidth, tileheight } = require(`/res/stage/${source}`) // eslint-disable-line  @typescript-eslint/no-var-requires
    const objectSize = new Vec2(tilewidth, tileheight)
    builders.push({
      firstgid,
      name,
      objectSize,
    })
  }
  builders.sort((a, b) => b.firstgid - a.firstgid)

  return function* (layer: TileLayer): Generator<Entity> {
    for (let x = 0; x < layer.width; x++) {
      for (let y = 0; y < layer.height; y++) {
        if (x < 0) continue
        if (y < 0) continue
        if (x >= layer.width) continue
        if (y >= layer.height) continue
        const tileId = layer.data[x + y * layer.width]
        if (tileId === 0) continue
        const builder = builders.find((builder: Builder): boolean => builder.firstgid <= tileId)
        assert(builder !== undefined, `Could not find appropriate builder for tileId ${tileId}`)
        const { firstgid, name, objectSize } = builder
        const frame = tileId - firstgid
        const tileClass = tileList[name]
        const index = new Vec2(x, y)
        const pos = new Vec2(
          index.x * tileSize.x + objectSize.x / 2,
          (index.y + 1) * tileSize.y - objectSize.y / 2
        )
        yield new tileClass(pos, name, frame).create()
      }
    }
  }
}
