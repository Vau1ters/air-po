import * as t from 'io-ts'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { assert } from '@utils/assertion'
import { tileList } from './tileList'
import { Stage } from './stage'
import { Entity } from '@core/ecs/entity'
import WallFactory from '@game/entities/wallFactory'
import { CustomPropertyType, getCustomProperty } from './customProperty'
import { toSoundName } from '@core/sound/sound'
import { getSingleton } from '@game/systems/singletonSystem'
import { TileSet } from './tileSet'

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

type Build = (index: Vec2, tileSize: Vec2, frame: number, layer: TileLayer) => void
type Builder = { firstgid: number; build: Build }

export class TileLayerLoader {
  private builders: Array<Builder>

  constructor(private stage: Stage, private world: World, tileSets: Array<TileSet>) {
    this.builders = this.loadBuilders(tileSets)
  }

  public load(layer: TileLayer, tileSize: Vec2): void {
    const findBuilder = (tileId: number): Builder => {
      for (let i = 0; i < this.builders.length; i++) {
        if (tileId < this.builders[i].firstgid) continue
        if (i < this.builders.length - 1 && this.builders[i + 1].firstgid <= tileId) continue
        return this.builders[i]
      }
      assert(false, `Could not find appropriate builder for tileId ${tileId}`)
    }

    for (let x = 0; x < layer.width; x++) {
      for (let y = 0; y < layer.height; y++) {
        const tileId = this.getTileId(layer, x, y)
        if (tileId === 0) continue
        const builder = findBuilder(tileId)
        builder.build(new Vec2(x, y), tileSize, tileId - builder.firstgid, layer)
      }
    }

    if (layer.name === 'map') {
      const bgmName = getCustomProperty<string>(layer, 'bgm')
      getSingleton('Bgm', this.world)
        .getComponent('Bgm')
        .request(bgmName ? toSoundName(bgmName) : undefined)
    }
  }

  private loadBuilders(tileSets: Array<TileSet>): Array<Builder> {
    const builders = new Array<Builder>()
    for (const { firstgid, source } of tileSets) {
      const { name, tilewidth, tileheight } = require(`/res/stage/${source}`) // eslint-disable-line  @typescript-eslint/no-var-requires
      const objectSize = new Vec2(tilewidth, tileheight)
      switch (name) {
        case 'wall':
          builders.push({
            firstgid,
            build: (index: Vec2, tileSize: Vec2, _: number, layer: TileLayer) =>
              this.world.addEntity(
                this.buildWall(
                  this.calcPosition(index, tileSize, objectSize),
                  index,
                  firstgid,
                  layer
                )
              ),
          })
          break
        default:
          builders.push({
            firstgid,
            build: (index: Vec2, tileSize: Vec2, frame: number) =>
              this.world.addEntity(
                new tileList[name as TileName](
                  this.calcPosition(index, tileSize, objectSize),
                  name,
                  frame,
                  this.world
                ).create()
              ),
          })
          break
      }
    }
    return builders
  }

  private calcPosition(index: Vec2, tileSize: Vec2, objectSize: Vec2): Vec2 {
    return new Vec2(
      index.x * tileSize.x + objectSize.x / 2,
      (index.y + 1) * tileSize.y - objectSize.y / 2
    )
  }

  private getTileId(layer: TileLayer, x: number, y: number): number {
    if (x < 0) return 0
    if (y < 0) return 0
    if (x >= layer.width) return 0
    if (y >= layer.height) return 0
    return layer.data[x + y * layer.width]
  }

  private buildWall(pos: Vec2, index: Vec2, firstgid: number, layer: TileLayer): Entity {
    const tileId = this.getTileId(layer, index.x, index.y) - firstgid
    const shouldCollide = [9, 10, 13, 14, 17, 18, 21, 22].every(id => tileId !== id)
    return new WallFactory(pos, tileId, shouldCollide).create()
  }
}
